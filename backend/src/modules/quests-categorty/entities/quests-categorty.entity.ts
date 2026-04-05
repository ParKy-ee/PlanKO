import { IsActive } from "src/commons/enums/is-Active.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "quests_categorty" })
export class QuestsCategorty {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description?: string;

    @Column({ default: IsActive.ACTIVE })
    is_active: IsActive;

    @Column({ default: new Date() })
    createdAt: Date;

    @Column({ default: new Date() })
    updatedAt: Date;
}
