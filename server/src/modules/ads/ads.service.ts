import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateAdOrderDto, RejectAdDto, SaveAdPackageDto, SaveAdPositionDto } from './dto/ad.dto';
import { Ad } from './ad.entity';
import { AdLog } from './ad-log.entity';
import { AdOrder } from './ad-order.entity';
import { AdPackage } from './ad-package.entity';
import { AdPosition } from './ad-position.entity';

@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(AdPosition) private readonly positions: Repository<AdPosition>,
    @InjectRepository(AdPackage) private readonly packages: Repository<AdPackage>,
    @InjectRepository(AdOrder) private readonly orders: Repository<AdOrder>,
    @InjectRepository(Ad) private readonly ads: Repository<Ad>,
    @InjectRepository(AdLog) private readonly logs: Repository<AdLog>,
  ) {}

  positionsList() { return this.positions.find({ where: { status: 1 }, order: { sort: 'DESC' } }); }

  packagesList(positionId?: string) { return this.packages.find({ where: { ...(positionId ? { positionId } : {}), status: 1 }, order: { sort: 'DESC' } }); }

  async createOrder(userId: string, dto: CreateAdOrderDto) {
    const pack = await this.packages.findOne({ where: { id: dto.packageId, positionId: dto.positionId, status: 1 } });
    if (!pack) throw new NotFoundException('Ad package not found');
    const startTime = dto.startTime ? new Date(dto.startTime) : new Date();
    const endTime = new Date(startTime);
    endTime.setDate(endTime.getDate() + pack.days);
    const order = await this.orders.save(this.orders.create({
      orderNo: `AD${Date.now()}${Math.floor(Math.random() * 1000)}`,
      userId,
      positionId: dto.positionId,
      packageId: dto.packageId,
      amount: pack.price,
      payAmount: pack.price,
      startTime,
      endTime,
    }));
    const ad = await this.ads.save(this.ads.create({
      orderId: order.id,
      userId,
      title: dto.title,
      imageUrl: dto.imageUrl,
      positionId: dto.positionId,
      linkType: dto.linkType ?? 'none',
      linkUrl: dto.linkUrl,
      startTime,
      endTime,
      status: 0,
    }));
    return { order, ad, payParams: { mock: true, orderNo: order.orderNo } };
  }

  myOrders(userId: string) { return this.orders.find({ where: { userId }, order: { createdAt: 'DESC' } }); }

  async myOrderDetail(userId: string, id: string) {
    const order = await this.orders.findOne({ where: { id, userId } });
    if (!order) throw new NotFoundException('Order not found');
    const ad = await this.ads.findOne({ where: { orderId: id } });
    return { order, ad };
  }

  listActive(positionId?: string) {
    const now = new Date();
    return this.ads.find({ where: { ...(positionId ? { positionId } : {}), status: 2, startTime: LessThanOrEqual(now), endTime: MoreThanOrEqual(now) }, order: { sort: 'DESC' } });
  }

  async log(adId: string, eventType: 'view' | 'click', userId?: string) {
    await this.logs.save(this.logs.create({ adId, userId, eventType }));
    await this.ads.increment({ id: adId }, eventType === 'view' ? 'viewCount' : 'clickCount', 1);
    return { recorded: true };
  }

  adminPositions() { return this.positions.find({ order: { sort: 'DESC' } }); }

  async createPosition(dto: SaveAdPositionDto) {
    return this.positions.save(this.positions.create({
      name: dto.name ?? '新广告位',
      code: dto.code ?? `position_${Date.now()}`,
      description: dto.description,
      width: dto.width,
      height: dto.height,
      maxCount: dto.maxCount ?? 1,
      pricePerDay: dto.pricePerDay ?? '0.00',
      status: dto.status ?? 1,
      sort: dto.sort ?? 0,
    }));
  }

  async updatePosition(id: string, dto: SaveAdPositionDto) {
    const position = await this.positions.findOne({ where: { id } });
    if (!position) throw new NotFoundException('Ad position not found');
    await this.positions.update(id, dto);
    return this.positions.findOne({ where: { id } });
  }

  async deletePosition(id: string) {
    const usedByPackage = await this.packages.exists({ where: { positionId: id } });
    if (usedByPackage) {
      await this.positions.update(id, { status: 0 });
      return { deleted: false, disabled: true };
    }
    await this.positions.delete(id);
    return { deleted: true };
  }

  adminPackages() { return this.packages.find({ relations: { position: true }, order: { sort: 'DESC' } }); }

  async createPackage(dto: SaveAdPackageDto) {
    if (!dto.positionId) throw new NotFoundException('Ad position not found');
    const position = await this.positions.findOne({ where: { id: dto.positionId } });
    if (!position) throw new NotFoundException('Ad position not found');
    return this.packages.save(this.packages.create({
      positionId: dto.positionId,
      name: dto.name ?? '新广告套餐',
      days: dto.days ?? 1,
      price: dto.price ?? '0.00',
      originalPrice: dto.originalPrice,
      description: dto.description,
      status: dto.status ?? 1,
      sort: dto.sort ?? 0,
    }));
  }

  async updatePackage(id: string, dto: SaveAdPackageDto) {
    const adPackage = await this.packages.findOne({ where: { id } });
    if (!adPackage) throw new NotFoundException('Ad package not found');
    if (dto.positionId) {
      const position = await this.positions.findOne({ where: { id: dto.positionId } });
      if (!position) throw new NotFoundException('Ad position not found');
    }
    await this.packages.update(id, dto);
    return this.packages.findOne({ where: { id } });
  }

  async deletePackage(id: string) {
    const usedByOrder = await this.orders.exists({ where: { packageId: id } });
    if (usedByOrder) {
      await this.packages.update(id, { status: 0 });
      return { deleted: false, disabled: true };
    }
    await this.packages.delete(id);
    return { deleted: true };
  }

  adminOrders() { return this.orders.find({ order: { createdAt: 'DESC' } }); }

  async approveAd(id: string) {
    await this.ads.update(id, { status: 2, rejectReason: undefined });
    const ad = await this.ads.findOne({ where: { id } });
    if (ad?.orderId) await this.orders.update(ad.orderId, { payStatus: 1, orderStatus: 3, payTime: new Date() });
    return ad;
  }

  async rejectAd(id: string, dto: RejectAdDto) {
    await this.ads.update(id, { status: 4, rejectReason: dto.rejectReason });
    const ad = await this.ads.findOne({ where: { id } });
    if (ad?.orderId) await this.orders.update(ad.orderId, { orderStatus: 5, rejectReason: dto.rejectReason });
    return ad;
  }
}
