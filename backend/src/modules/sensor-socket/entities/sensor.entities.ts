import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sensor_data')
export class SensorData {
    @PrimaryGeneratedColumn()
    id: number;

    // R -> BIGINT
    @Column({ type: 'bigint' })
    r: string; // TypeORM จะคืนค่า bigint เป็น string เพื่อป้องกันการสูญเสียข้อมูล (Precision loss)

    // RED -> BIGINT
    @Column({ type: 'bigint' })
    red: string;

    // Finger YES/NO -> BOOLEAN
    @Column({ type: 'boolean', name: 'finger_detected' })
    fingerDetected: boolean;

    // BPM -> FLOAT
    @Column({ type: 'float' })
    bpm: number;

    // AVG BPM -> INT
    @Column({ type: 'int', name: 'avg_bpm' })
    avgBpm: number;

    // SpO2 approx -> FLOAT
    @Column({ type: 'float', name: 'spo2_approx' })
    spo2Approx: number;

    // เวลาเก็บข้อมูล -> TIMESTAMP
    @CreateDateColumn({ type: 'timestamp', name: 'recorded_at' })
    recordedAt: Date;
}
