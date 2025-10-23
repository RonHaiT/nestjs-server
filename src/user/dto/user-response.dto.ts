export class UserResponseDto {
  id: number;
  username: string;
  // 注意：不包含 password 字段，确保安全性
}

export class UserListResponseDto {
  data: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
