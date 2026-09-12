import { useCallback, useEffect, useState } from 'react';
import {
    atualizarMedico,
    criarMedico,
    excluirMedico,
    listarMedicos,
} from '../repositories/medicoRepositorio';
import { CriarMedicoInput, Medico } from '../models/medicoModel';

export function useMedicos() {
    const [medicos, setMedicos] = useState<Medico[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<unknown>(null);

    const carregar = useCallback(async () => {
        try {
            setCarregando(true);
            setErro(null);
            setMedicos(await listarMedicos());
        } catch (error) {
            setErro(error);
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => { carregar(); }, [carregar]);

    async function adicionar(dados: CriarMedicoInput) {
        const novoMedico = await criarMedico(dados);
        setMedicos(lista => [...lista, novoMedico]);
    }

    async function atualizar(id: number, dados: CriarMedicoInput) {
        const atualizado = await atualizarMedico(id, dados);
        setMedicos(lista => lista.map(item => item.id === id ? atualizado : item));
    }

    async function remover(id: number) {
        await excluirMedico(id);
        setMedicos(lista => lista.filter(item => item.id !== id));
    }

    return { medicos, carregando, erro, carregar, adicionar, atualizar, remover };
}