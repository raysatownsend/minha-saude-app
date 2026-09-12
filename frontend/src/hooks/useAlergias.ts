import { useCallback, useEffect, useState } from 'react';
import {
    atualizarAlergia,
    criarAlergia,
    excluirAlergia,
    listarAlergias,
} from '../repositories/alergiaRepositorio';
import { Alergia, CriarAlergiaInput } from '../models/alergiaModel';

export function useAlergias() {
    const [alergias, setAlergias] = useState<Alergia[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<unknown>(null);

    const carregar = useCallback(async () => {
        try {
            setCarregando(true);
            setErro(null);
            setAlergias(await listarAlergias());
        } catch (error) {
            setErro(error);
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    async function adicionar(dados: CriarAlergiaInput) {
        const novaAlergia = await criarAlergia(dados);
        setAlergias(lista => [...lista, novaAlergia]);
    }

    async function atualizar(id: number, alergia: string) {
        const atualizada = await atualizarAlergia(id, { alergia });
        setAlergias(lista => lista.map(item => item.id === id ? atualizada : item));
    }

    async function remover(id: number) {
        await excluirAlergia(id);
        setAlergias(lista => lista.filter(item => item.id !== id));
    }

    return { alergias, carregando, erro, carregar, adicionar, atualizar, remover };
}