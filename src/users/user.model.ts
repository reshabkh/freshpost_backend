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
  underscored: true,
  timestamps: true,
  paranoid: true,
  freezeTableName: true,
  tableName: 'users'
})
export class User extends Model {
  @PrimaryKey
  @IsUUID(4)
  @AllowNull(false)
  @Default(uuid4)
  @Unique(true)
  @Column
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contactNo: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profileImg: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  accessToken: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  interests: string[];
  
}
