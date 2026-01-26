import { ObjectLiteral, Repository } from 'typeorm';
import { BaseQueryDto } from '../dtos/base-query.dto';

export class QueryHelper {
    static async paginate<T extends ObjectLiteral>(
        repository: Repository<T>,
        query: BaseQueryDto,
        options: {
            sortField: keyof T,
            relations?: (keyof T)[],
            searchableFields?: (keyof T)[],
            where?: any
        }
    ) {
        const { id, isActive, sort_order } = query;
        const page = query.page || 1;
        const limit = query.limit || 20;

        let where: any = options.where || {};

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        if (id !== undefined) {
            where.id = id;
        }

        for (const key of Object.keys(query)) {
            if (['page', 'limit', 'sort_order', 'id', 'isActive'].includes(key)) {
                continue;
            }

            if (options.searchableFields?.includes(key)) {
                where[key] = query[key];
            }

            if (options.relations?.includes(key)) {
                where[key] = query[key];
            }

        }

        const order: any = {};
        order[options.sortField] = sort_order === 'DESC' ? 'DESC' : 'ASC';

        const [items, total] = await repository.findAndCount({
            where,
            order,
            relations: options.relations as string[],
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data: items,
            meta: {
                totalItems: total,
                itemCount: items.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
            },
        };
    }
}