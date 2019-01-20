import { UserRole } from '../enums/user-role.enum';

export interface UserResponseObject {
  id: string;
  created: Date;
  email: string;
  name: string;
  role: UserRole;
  token?: string;
}
