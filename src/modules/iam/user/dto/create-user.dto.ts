import { Gender } from "../entities/user.entity";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  fullName: string;

  @ApiPropertyOptional({ example: 'J. Doe', description: 'International name of the user' })
  internationalName?: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE, description: 'Gender of the user' })
  gender: Gender;

  @ApiPropertyOptional({ type: String, format: 'date', example: '1990-01-01', description: 'Birthdate of the user' })
  birthdate?: Date;

  @ApiProperty({ example: '+1234567890', description: 'Phone number of the user' })
  phoneNumber: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com', description: 'Email address of the user' })
  email?: string;

  @ApiProperty({ example: 'strongPassword123', description: 'Password for the user account' })
  password: string;
}
