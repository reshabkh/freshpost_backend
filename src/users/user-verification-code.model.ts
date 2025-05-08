import {
    AllowNull,
    AutoIncrement,
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
    tableName: 'user_verification_code'
  })
  export class UserVerificationCode extends Model {
    @PrimaryKey
    @IsUUID(4)
    @AllowNull(false)
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;
  
    @AllowNull(false)
    @Column(DataType.INTEGER)
    code: number;
  
    @AllowNull(false)
    @Column(DataType.STRING(255))
    contactNo: string;
  }