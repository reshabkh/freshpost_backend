import {
  AllowNull,
  Column,
  DataType,
  Default,
  IsEmail,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { v4 as uuid4 } from 'uuid';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
  freezeTableName: true,
})
export class User extends Model<User> {
  @PrimaryKey
  @IsUUID(4)
  @AllowNull(false)
  @Default(uuid4)
  @Unique(true)
  @Column
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @IsEmail()
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contact_no: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profileImg: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  accessToken: string;
}
