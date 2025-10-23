import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { GetUserDto } from './dto/get-user.dto';
import { UserResponseDto, UserListResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  async findAll(getUserDto: GetUserDto): Promise<UserListResponseDto> {
    const { username, page = 1, limit = 10 } = getUserDto;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // 如果提供了用户名，进行模糊查询
    if (username) {
      queryBuilder.where('user.username LIKE :username', {
        username: `%${username}%`,
      });
    }

    // 分页查询
    const [users, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    // 过滤掉敏感信息，只返回需要的字段
    const safeUsers: UserResponseDto[] = users.map((user) => ({
      id: user.id,
      username: user.username,
    }));

    return {
      data: safeUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
