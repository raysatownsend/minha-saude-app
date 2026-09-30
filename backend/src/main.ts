import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import type { NextFunction, Request, Response } from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Nenhuma resposta da API pode ficar guardada no cache do celular:
    // 1) sem isso, o iOS às vezes devolve uma resposta ANTIGA de um GET
    //    (ex.: /alergias) em vez de perguntar de novo ao servidor, e a
    //    tela mostra dados desatualizados mesmo depois de salvar;
    // 2) são dados de saúde: não devem ficar gravados no disco do
    //    aparelho fora do controle do app.
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Cache-Control', 'no-store');
        if (process.env.NODE_ENV !== 'production') {
            // Mostra no terminal cada requisição que CHEGOU ao backend.
            // Se o app diz que buscou os dados e a linha não aparece aqui,
            // a resposta veio de um cache, não do servidor.
            console.log(`[api] ${req.method} ${req.originalUrl}`);
        }
        next();
    });

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    await app.listen(Number(process.env.PORT ?? 3000));
}

bootstrap();