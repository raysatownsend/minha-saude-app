import { useCallback, useEffect, useState } from 'react';
import {
    atualizarCirurgia,
    criarCirurgia,
    excluirCirurgia,
    listarCirurgias,
} from '../repositories/cirurgiaRepositorio';
import { Cirurgia, CriarCirurgiaInput } from '../models/cirurgiaModel';

export function useCirurgias() {
    const [cirurgias, setCirurgias] = useState<Cirurgia[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<unknown>(null);

    const carregar = useCallback(async () => {
        try {
            setCarregando(true);
            setErro(null);
            setCirurgias(await listarCirurgias());
        } catch (error) {
            setErro(error);
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => { carregar(); }, [carregar]);

    async function adicionar(dados: CriarCirurgiaInput) {
        const novaCirurgia = await criarCirurgia(dados);
        setCirurgias(lista => [...lista, novaCirurgia]);
    }

    async function atualizar(id: number, dados: CriarCirurgiaInput) {
        const atualizada = await atualizarCirurgia(id, dados);
        setCirurgias(lista => lista.map(item => item.id === id ? atualizada : item));
    }

    async function remover(id: number) {
        await excluirCirurgia(id);
        setCirurgias(lista => lista.filter(item => item.id !== id));
    }

    return { cirurgias, carregando, erro, carregar, adicionar, atualizar, remover };
}