import 'reflect-metadata';
import AppDataSource from './src/database/data-source';
import { User } from './src/modules/user/entities/user.entity';
import { Quest } from './src/modules/quest/entities/quest.entity';
import { QuestCategory } from './src/modules/quest-category/entities/quest-category.entity';
import { PostureCategory } from './src/modules/posture-category/entities/posture-category.entity';
import { Posture } from './src/modules/posture/entities/posture.entity';
import { Program } from './src/modules/program/entities/program.entity';
import { Difficulty } from './src/commons/enums/difficulty.enum';
import { Unit } from './src/commons/enums/unit.enum';
import { QuestType } from './src/commons/enums/quest-type.enum';
import { ProgramType } from './src/commons/enums/prtogram-type.enum';
import { Role } from './src/commons/enums/role.enum';

async function seed() {
    try {
        await AppDataSource.initialize();
        console.log('📦 Data Source has been initialized!');

        // 1. Seed Quest Categories
        const questCatRepo = AppDataSource.getRepository(QuestCategory);
        const qCat1 = questCatRepo.create({ name: 'การฝึกฝน', description: 'ภารกิจเกี่ยวกับการออกกำลังกาย' });
        const qCat2 = questCatRepo.create({ name: 'สุขภาพ', description: 'ภารกิจเกี่ยวกับการดูแลสุขภาพทั่วไป' });
        await questCatRepo.save([qCat1, qCat2]);
        console.log('✅ Quest Categories seeded');

        // 2. Seed Quests
        const questRepo = AppDataSource.getRepository(Quest);
        await questRepo.save([
            {
                name: 'Plank เริ่มต้น',
                goal_value: 60,
                unit: Unit.second,
                quest_type: QuestType.DAILY,
                xp_reward: 100,
                coin_reward: 50,
                difficulty: Difficulty.EASY,
                questCategory: qCat1,
                description: 'ทำ Plank ต่อเนื่อง 60 วินาที'
            },
            {
                name: 'นักสู้รายสัปดาห์',
                goal_value: 5,
                unit: Unit.session,
                quest_type: QuestType.WEEKLY,
                xp_reward: 500,
                coin_reward: 200,
                difficulty: Difficulty.MEDIUM,
                questCategory: qCat1,
                description: 'ออกกำลังกายครบ 5 เซสชั่นในหนึ่งสัปดาห์'
            }
        ]);
        console.log('✅ Quests seeded');

        // 3. Seed Posture Categories
        const postureCatRepo = AppDataSource.getRepository(PostureCategory);
        const pCat1 = postureCatRepo.create({ name: 'ท่าพื้นฐาน', description: 'ท่า Plank สำหรับผู้เริ่มต้น' });
        const pCat2 = postureCatRepo.create({ name: 'ท่าขั้นสูง', description: 'ท่า Plank สำหรับผู้ที่ต้องการความท้าทาย' });
        await postureCatRepo.save([pCat1, pCat2]);
        console.log('✅ Posture Categories seeded');

        // 4. Seed Postures
        const postureRepo = AppDataSource.getRepository(Posture);
        await postureRepo.save([
            {
                name: 'Full Plank',
                description: 'ท่า Plank พื้นฐานโดยใช้เหยียดแขนตรง',
                difficulty: Difficulty.EASY,
                postureCategory: pCat1,
                is_active: true
            },
            {
                name: 'Elbow Plank',
                description: 'วางศอกลงกับพื้น ขนานกับลำตัว',
                difficulty: Difficulty.EASY,
                postureCategory: pCat1,
                is_active: true
            },
            {
                name: 'Side Plank',
                description: 'นอนตะแคงแล้วยกตัวขึ้นด้วยศอกเดียว',
                difficulty: Difficulty.MEDIUM,
                postureCategory: pCat2,
                is_active: true
            }
        ]);
        console.log('✅ Postures seeded');

        // 5. Seed Programs
        const programRepo = AppDataSource.getRepository(Program);
        await programRepo.save([
            {
                programName: 'ลดหน้าท้องเบื้องต้น',
                programType: ProgramType.WEIGHTLOSS,
                period: 30,
                frequency: 1,
                workDays: [1, 2, 3, 5, 6],
                restDays: [4, 7],
                is_active: true,
                total_kcal: 5000
            }
        ]);
        console.log('✅ Programs seeded');

        // 6. Seed User (Admin and Demo User)
        const userRepo = AppDataSource.getRepository(User);
        const admin = userRepo.create({
            name: 'admin',
            email: 'admin@planko.com',
            password: 'password123', // จะถูก Hash โดย BeforeInsert ใน Entity
            role: Role.ADMIN,
            isActive: true
        });
        const user = userRepo.create({
            name: 'demo_user',
            email: 'user@planko.com',
            password: 'password123',
            role: Role.USER,
            isActive: true,
            weight: 70,
            height: 175,
            age: 25,
            gender: 'male'
        });
        await userRepo.save([admin, user]);
        console.log('✅ Users seeded');

        console.log('🚀 Seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error during seeding:', error);
    } finally {
        await AppDataSource.destroy();
    }
}

seed();
