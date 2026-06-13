import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionPerfomance } from '../seesion-perfomance/entities/seesion-perfomance.entity';
import { PostureCategory } from '../posture-category/entities/posture-category.entity';
import { Posture } from '../posture/entities/posture.entity';

@Injectable()
export class HomeDashboardService {
  constructor(
    @InjectRepository(SessionPerfomance)
    private readonly sessionPerformanceRepo: Repository<SessionPerfomance>,
    @InjectRepository(PostureCategory)
    private readonly postureCategoryRepo: Repository<PostureCategory>,
    @InjectRepository(Posture)
    private readonly postureRepo: Repository<Posture>,
  ) {}

  async getDashboardData(userId: number) {
    // 1. Overview data from Session Performance
    const sessionKcal = await this.sessionPerformanceRepo
      .createQueryBuilder('sp')
      .select('SUM(sp.kcal)', 'totalKcal')
      .where('sp.user_id = :userId', { userId })
      .getRawOne();
      
    const totalCaloriesBurned = Number(sessionKcal?.totalKcal) || 0;
    const targetCalories = 2000; // Expected daily target 
    const calorieProgressPercent = Math.min(100, Math.round((totalCaloriesBurned / targetCalories) * 100));

    // 2. Developments
    // Calculate how many unique postures from each category a user completed
    const completedPosturesInfo = await this.sessionPerformanceRepo
      .createQueryBuilder('sp')
      .innerJoin('sp.plankSession', 'ps')
      .innerJoin('ps.plankBySessions', 'pbs')
      .innerJoin('pbs.posture', 'posture')
      .innerJoin('posture.postureCategory', 'cat')
      .select('cat.id', 'categoryId')
      .addSelect('COUNT(DISTINCT posture.id)', 'completedCount')
      .where('sp.user_id = :userId', { userId })
      .andWhere('sp.completed = true')
      .groupBy('cat.id')
      .getRawMany();

    const completedMap: Record<number, number> = {};
    completedPosturesInfo.forEach(item => {
        completedMap[item.categoryId] = Number(item.completedCount);
    });

    const categories = await this.postureCategoryRepo.find({ relations: ['postures'] });
    const developments = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      current: completedMap[cat.id] || 0,
      target: cat.postures?.length && cat.postures.length > 0 ? cat.postures.length : 10,
    }));

    // 3. Postures 
    const activePostures = await this.postureRepo.find({
      where: { is_active: true },
      relations: ['postureCategory'],
      take: 10,
    });
    
    const postures = activePostures.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.postureCategory?.name || 'ทั้งหมด',
      imageUrl: '' 
    }));

    return {
      overview: {
        totalCaloriesBurned,
        calorieProgressPercent,
      },
      developments,
      postures,
    };
  }
}

