import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { ProductImage } from './';
import { User } from '../../auth/entities/user.entity';


@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '022758bf-53f7-42ab-9e7a-0b1163b8e683',
    description: 'Product ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-Shirt Teslo',
    description: 'Product Title',
    uniqueItems: true
  })
  @Column('text', {
    unique: true
  })
  title: string;

  @ApiProperty({
    example: 0,
    description: 'Product Price'
  })
  @Column('float', {
    default: 0
  })
  price: number;

  @ApiProperty({
    
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean risus elit, ullamcorper eget nisl nec, tempus tempor lorem. Vestibulum euismod orci eu tellus convallis, a eleifend metus posuere.',
    description: 'Product Description',
    default: null
  })
  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @ApiProperty({
    example: 't_shirt_teslo',
    description: 'Product SLUG - for SEO',
    uniqueItems: true
  })
  @Column('text', {
    unique: true
  })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product Stock',
    default: 0
  })
  @Column('int', {
    default: 0
  })
  stock: number;

  @ApiProperty({
    example: ['L', 'XL', 'XXL'],
    description: 'Product Sizes'
  })
  @Column('text', {
    array: true
  })
  sizes: string[];

  @ApiProperty({
    example: 'women',
    description: 'Product Gender'
  })
  @Column('text')
  gender: string;

  @ApiProperty()
  @Column('text', {
    array: true,
    default: []
  })
  tags: string[];


  @ApiProperty()
  @OneToMany(
    () => ProductImage,
    (productImage) => productImage.product,
    { cascade: true, eager: true }
  )
  images?: ProductImage[];

  @ManyToOne(
    () => User,
    ( user ) => user.product,
    { eager: true }
  )
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if ( !this.slug ) {
      this.slug = this.title
        .toLowerCase()
        .replaceAll( ' ', '_' )
        .replaceAll( "'", '' )
    } 

    this.slug = this.slug
      .toLowerCase()
      .replaceAll( ' ', '_' )
      .replaceAll( "'", '' )
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll( ' ', '_' )
      .replaceAll( "'", '' )
  }
}
