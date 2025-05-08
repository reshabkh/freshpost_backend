import {
    AllowNull,
    BelongsTo,
    Column,
    DataType,
    Default,
    ForeignKey,
    IsEmail,
    IsUUID,
    Model,
    PrimaryKey,
    Table,
    Unique,
  } from 'sequelize-typescript';
  import { v4 as uuid4 } from 'uuid';
import { User } from './user.model';
  
  @Table({
    underscored: true,
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'user_interests'
  })
  export class UserInterests extends Model {
    @PrimaryKey
    @IsUUID(4)
    @AllowNull(false)
    @Default(uuid4)
    @Unique(true)
    @Column
    declare id: string;

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column({
        type: DataType.STRING,
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
    })
    userId: string;

    @BelongsTo(() => User)
    user: User;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    interest: string;

    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    prompt: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    interestImg: string;

  }
  