import { useCallback, useEffect, useState } from 'react';

import {
    listarDoencas,
    criarDoenca,
    atualizarDoenca,
    excluirDoenca,
} from '../repositories/doencaRepositorio';
import { Doenca, CriarDoencaInput } from '../models/doencaModel';

export function useDoencas() {
    const [doencas, setDoencas] = useState<Doenca[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<unknown>(null);

    const carregar = useCallback( async () => {
        try {
            setCarregando(true);
            setErro(null);
            setDoencas(await listarDoencas());
        } catch (error) {
            setErro(error);
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    async function adicionar(dados: CriarDoencaInput) {
        const novaDoenca = await criarDoenca(dados);
        setDoencas(lista => [...lista, novaDoenca]);
    }

    async function atualizar(id: number, doenca: string) {
        const atualizada = await atualizarDoenca(id, { doenca });
        setDoencas(lista => lista.map(item => item.id === id ? atualizada : item));
    }

    async function remover(id: number) {
        await excluirDoenca(id);
        setDoencas(lista => lista.filter(item => item.id !== id));
    }

    return {
        doencas,
        carregando,
        erro,
        carregar,
        adicionar,
        atualizar,
        remover
    };
}