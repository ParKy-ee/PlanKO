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
        let qCat1 = await questCatRepo.findOne({ where: { name: 'การฝึกฝน' } });
        if (!qCat1) {
            qCat1 = questCatRepo.create({ name: 'การฝึกฝน', description: 'ภารกิจเกี่ยวกับการออกกำลังกาย' });
            await questCatRepo.save(qCat1);
        }
        let qCat2 = await questCatRepo.findOne({ where: { name: 'สุขภาพ' } });
        if (!qCat2) {
            qCat2 = questCatRepo.create({ name: 'สุขภาพ', description: 'ภารกิจเกี่ยวกับการดูแลสุขภาพทั่วไป' });
            await questCatRepo.save(qCat2);
        }
        console.log('✅ Quest Categories seeded');

        // 2. Seed Quests
        const questRepo = AppDataSource.getRepository(Quest);
        const quests = [
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
        ];

        for (const q of quests) {
            const existing = await questRepo.findOne({ where: { name: q.name } });
            if (!existing) {
                await questRepo.save(q);
            }
        }
        console.log('✅ Quests seeded');

        // 3. Seed Posture Categories
        const postureCatRepo = AppDataSource.getRepository(PostureCategory);
        const categories = [
            { name: 'ท่าพื้นฐาน', description: 'ท่า Plank สำหรับผู้เริ่มต้น' },
            { name: 'ท่าขั้นสูง', description: 'ท่า Plank สำหรับผู้ที่ต้องการความท้าทาย' },
            { name: 'Dynamic Plank', description: 'เน้น การเคลื่อนไหว เพื่อเพิ่มความทนทาน ความแข็งแรง และการควบคุมร่างกาย' },
            { name: 'Stability / Balance Plank', description: 'เน้น การทรงตัว ลดจุดสัมผัสพื้น ทำให้ core ทำงานหนักขึ้น' },
            { name: 'Resistance Plank', description: 'เพิ่ม แรงต้าน เพื่อเพิ่มความแข็งแรงของกล้ามเนื้อ' },
            { name: 'Advanced / Functional Plank', description: 'ผสม หลายความสามารถ ทั้งแรง ความเร็ว และการควบคุม' }
        ];

        const catMap: Record<string, PostureCategory> = {};
        for (const cat of categories) {
            let existing = await postureCatRepo.findOne({ where: { name: cat.name } });
            if (!existing) {
                existing = await postureCatRepo.save(postureCatRepo.create(cat));
            }
            catMap[cat.name] = existing;
        }
        console.log('✅ Posture Categories seeded');

        // 4. Seed Postures
        const postureRepo = AppDataSource.getRepository(Posture);
        const posturesData = [
            {
                name: 'Full Plank',
                description: 'ท่า Plank พื้นฐานโดยใช้เหยียดแขนตรง',
                benefit: 'core strength',
                posture_position: 'High Plank',
                difficulty: Difficulty.EASY,
                postureCategory: catMap['ท่าพื้นฐาน'],
                is_active: true
            },
            {
                name: 'Elbow Plank',
                description: 'วางศอกลงกับพื้น ขนานกับลำตัว',
                benefit: 'core stability',
                posture_position: 'Forearm Plank',
                difficulty: Difficulty.EASY,
                postureCategory: catMap['ท่าพื้นฐาน'],
                is_active: true
            },
            {
                name: 'Side Plank',
                description: 'นอนตะแคงแล้วยกตัวขึ้นด้วยศอกเดียว',
                benefit: 'obliques',
                posture_position: 'Side Plank',
                difficulty: Difficulty.MEDIUM,
                postureCategory: catMap['ท่าขั้นสูง'],
                is_active: true
            },
            // Dynamic Plank
            {
                name: 'Up-Down Plank',
                description: 'สลับศอกขึ้นเป็นมือ ใช้ทั้ง core และแขน',
                benefit: 'เพิ่มความแข็งแรง core + แขน + coordination',
                posture_position: 'เริ่ม Forearm → ดันขึ้นเป็น High Plank → กลับลงศอก ลำตัวต้องนิ่ง. วางมือ/ศอก: (3)-(3), (4)-(4) , ง่าย: (2)-(2) , ยาก: (5)-(5)',
                difficulty: Difficulty.MEDIUM,
                postureCategory: catMap['Dynamic Plank'],
                is_active: true
            },
            {
                name: 'Mountain Climbers',
                description: 'ดึงเข่าสลับเข้าหน้าอก',
                benefit: 'เผาผลาญพลังงาน + core + ความเร็ว',
                posture_position: 'High Plank แล้วดึงเข่าเร็ว ๆ โดยลำตัวไม่เด้ง. วางมือ: (3)-(3) , ง่าย: (2)-(2) , ยาก: (5)-(5), (6)-(6)',
                difficulty: Difficulty.MEDIUM,
                postureCategory: catMap['Dynamic Plank'],
                is_active: true
            },
            {
                name: 'Plank Shoulder Tap',
                description: 'แตะไหล่สลับ',
                benefit: 'core + balance + coordination',
                posture_position: 'High Plank แล้วใช้มือแตะไหล่อีกข้าง ลำตัวไม่บิด. วางมือ: (3)-(3) , ง่าย: (2)-(2) , ยาก: (5)-(5)',
                difficulty: Difficulty.MEDIUM,
                postureCategory: catMap['Dynamic Plank'],
                is_active: true
            },
            {
                name: 'Plank Hip Dip',
                description: 'หมุนสะโพก',
                benefit: 'เสริม obliques + ควบคุมลำตัว',
                posture_position: 'Forearm Plank แล้วหมุนสะโพกซ้าย–ขวา. วางข้อศอก: (3)-(3) , ง่าย: (2)-(2) , ยาก: (5)-(5)',
                difficulty: Difficulty.MEDIUM,
                postureCategory: catMap['Dynamic Plank'],
                is_active: true
            },
            // Stability / Balance Plank
            {
                name: 'Plank with Leg Lift',
                description: 'ยกขา',
                benefit: 'core + ก้น + balance',
                posture_position: 'Plank ปกติ แล้วยกขาข้างหนึ่ง ลำตัวนิ่ง. วางมือ/ศอก: (3)-(3) , ง่าย: (2)-(2) , ยาก: (5)-(5), (6)-(6)',
                difficulty: Difficulty.MEDIUM,
                postureCategory: catMap['Stability / Balance Plank'],
                is_active: true
            },
            {
                name: 'Plank with Arm Lift',
                description: 'ยกแขน',
                benefit: 'anti-rotation + stability',
                posture_position: 'ยกแขนไปด้านหน้าโดยไม่ให้ตัวเอียง. วางมือ (ข้างเดียว): (3) , ง่าย: (2) , ยาก: (5)',
                difficulty: Difficulty.MEDIUM,
                postureCategory: catMap['Stability / Balance Plank'],
                is_active: true
            },
            {
                name: 'Bird Dog Plank',
                description: 'ยกแขน+ขาตรงข้าม',
                benefit: 'coordination + core',
                posture_position: 'ยกแขนและขาตรงข้าม ลำตัวต้องนิ่ง. วางมือ: (3) , ง่าย: (2) , ยาก: (5)',
                difficulty: Difficulty.HARD,
                postureCategory: catMap['Stability / Balance Plank'],
                is_active: true
            },
            {
                name: 'Stability Ball Plank',
                description: 'ใช้อุปกรณ์',
                benefit: 'balance สูง + core',
                posture_position: 'คุมลำตัวบนลูกบอล ❌ ไม่ใช้เสื่อ (วางบนลูกบอล)',
                difficulty: Difficulty.HARD,
                postureCategory: catMap['Stability / Balance Plank'],
                is_active: true
            },
            // Resistance Plank
            {
                name: 'Weighted Plank',
                description: 'มีน้ำหนัก',
                benefit: 'core แข็งแรงมากขึ้น',
                posture_position: 'Plank ปกติ วางน้ำหนักบนหลัง. วางมือ/ศอก: (3)-(3) , ง่าย: (2)-(2) , ยาก: (5)-(5), (6)-(6)',
                difficulty: Difficulty.HARD,
                postureCategory: catMap['Resistance Plank'],
                is_active: true
            },
            {
                name: 'Resistance Band Plank',
                description: 'แรงยางยืด',
                benefit: 'เพิ่มแรงต้าน + control',
                posture_position: 'Plank พร้อมแรงดึงจาก band. วางมือ/ศอก: (3)-(3) , ง่าย: (2)-(2) , ยาก: (5)-(5)',
                difficulty: Difficulty.MEDIUM,
                postureCategory: catMap['Resistance Plank'],
                is_active: true
            },
            {
                name: 'TRX Plank',
                description: 'ใช้ TRX',
                benefit: 'core + balance สูง',
                posture_position: 'เท้าลอย ลำตัวนิ่ง. วางมือ/ศอก: (3)-(3) , ง่าย: (2)-(2) , ยาก: (5)-(5)',
                difficulty: Difficulty.HARD,
                postureCategory: catMap['Resistance Plank'],
                is_active: true
            },
            // Advanced / Functional Plank
            {
                name: 'Plank to Push-up',
                description: 'ศอก → มือ',
                benefit: 'core + strength',
                posture_position: 'เปลี่ยนจาก Forearm เป็น High Plank. วางศอก/มือ: (3)-(3), (4)-(4) , ง่าย: (2)-(2) , ยาก: (5)-(5)',
                difficulty: Difficulty.HARD,
                postureCategory: catMap['Advanced / Functional Plank'],
                is_active: true
            },
            {
                name: 'Spiderman Plank',
                description: 'ดึงเข่าด้านข้าง',
                benefit: 'core + hip mobility',
                posture_position: 'ดึงเข่าไปด้านข้างใกล้ศอก. วางมือ: (3)-(3) , ง่าย: (2)-(2) , ยาก: (5)-(5)',
                difficulty: Difficulty.MEDIUM,
                postureCategory: catMap['Advanced / Functional Plank'],
                is_active: true
            },
            {
                name: 'Plank Jack',
                description: 'กระโดดขา',
                benefit: 'cardio + core',
                posture_position: 'กระโดดแยก–หุบขา. วางมือ: (3)-(3) , ง่าย: (2)-(2) , ยาก: (5)-(5)',
                difficulty: Difficulty.MEDIUM,
                postureCategory: catMap['Advanced / Functional Plank'],
                is_active: true
            },
            {
                name: 'Walking Plank',
                description: 'เคลื่อนที่',
                benefit: 'coordination + strength',
                posture_position: 'เดินมือไปด้านหน้า/ข้าง. เริ่ม: (3)-(3) , ง่าย: (2)-(2) , ยาก: (5)-(5), (6)-(6)',
                difficulty: Difficulty.HARD,
                postureCategory: catMap['Advanced / Functional Plank'],
                is_active: true
            }
        ];

        for (const p of posturesData) {
            const existing = await postureRepo.findOne({ where: { name: p.name } });
            if (!existing) {
                await postureRepo.save(postureRepo.create(p));
            }
        }
        console.log('✅ Postures seeded');

        // 5. Seed Programs
        const programRepo = AppDataSource.getRepository(Program);
        const programs = [
            {
                programName: 'ลดหน้าท้องเบื้องต้น',
                programType: ProgramType.WEIGHTLOSS,
                period: 1, // reduced for testing? keeping it as is from original
                frequency: 1,
                workDays: [1, 2, 3, 5, 6],
                restDays: [4, 7],
                is_active: true,
                total_kcal: 5000
            }
        ];
        for (const prog of programs) {
            const existing = await programRepo.findOne({ where: { programName: prog.programName } });
            if (!existing) {
                // Fix period if it was changed
                const pToSave = { ...prog, period: 30 }; 
                await programRepo.save(pToSave);
            }
        }
        console.log('✅ Programs seeded');

        // 6. Seed User (Admin and Demo User)
        const userRepo = AppDataSource.getRepository(User);
        const existingAdmin = await userRepo.findOne({ where: { email: 'admin@planko.com' } });
        if (!existingAdmin) {
            const admin = userRepo.create({
                name: 'admin',
                email: 'admin@planko.com',
                password: 'password123',
                role: Role.ADMIN,
                isActive: true
            });
            await userRepo.save(admin);
        }

        const existingUser = await userRepo.findOne({ where: { email: 'user@planko.com' } });
        if (!existingUser) {
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
            await userRepo.save(user);
        }
        console.log('✅ Users seeded');

        console.log('🚀 Seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error during seeding:', error);
    } finally {
        await AppDataSource.destroy();
    }
}

seed();
