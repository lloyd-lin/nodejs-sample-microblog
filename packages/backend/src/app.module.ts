import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './modules/chat/chat.module';
// import { AuthModule } from './modules/auth/auth.module';
// import { UsersModule } from './modules/users/users.module';
// import { PostsModule } from './modules/posts/posts.module';
// import { CommentsModule } from './modules/comments/comments.module';
// import { User } from './modules/users/entities/user.entity';
// import { Post } from './modules/posts/entities/post.entity';
// import { Comment } from './modules/comments/entities/comment.entity';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    
    // 数据库模块 - 暂时注释掉
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get('DB_HOST', 'localhost'),
    //     port: parseInt(configService.get('DB_PORT', '5432')),
    //     username: configService.get('DB_USERNAME', 'postgres'),
    //     password: configService.get('DB_PASSWORD', ''),
    //     database: configService.get('DB_DATABASE', 'microblog'),
    //     entities: [User, Post, Comment],
    //     synchronize: configService.get('NODE_ENV') !== 'production',
    //     logging: configService.get('NODE_ENV') === 'development',
    //   }),
    //   inject: [ConfigService],
    // }),
    
    // 聊天模块
    ChatModule,
    
    // 业务模块 - 暂时注释掉
    // AuthModule,
    // UsersModule,
    // PostsModule,
    // CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 