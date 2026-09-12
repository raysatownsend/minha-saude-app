import { useCallback, useEffect, useState } from 'react';
import {
    atualizarMedicamento,
    criarMedicamento,
    excluirMedicamento,
    listarMedicamentos,
} from '../repositories/medicamentoRepositorio';
import { CriarMedicamentoInput, Medicamento } from '../models/medicamentoModel';

export function useMedicamentos() {
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<unknown>(null);

    const carregar = useCallback(async () => {
        try {
            setCarregando(true);
            setErro(null);
            setMedicamentos(await listarMedicamentos());
        } catch (error) {
            setErro(error);
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => { carregar(); }, [carregar]);

    async function adicionar(dados: CriarMedicamentoInput) {
        const novoMedicamento = await criarMedicamento(dados);
        setMedicamentos(lista => [...lista, novoMedicamento]);
    }

    async function atualizar(id: number, dados: CriarMedicamentoInput) {
        const atualizado = await atualizarMedicamento(id, dados);
        setMedicamentos(lista => lista.map(item => item.id === id ? atualizado : item));
    }

    async function remover(id: number) {
        await excluirMedicamento(id);
        setMedicamentos(lista => lista.filter(item => item.id !== id));
    }

    return { medicamentos, carregando, erro, carregar, adicionar, atualizar, remover };
}