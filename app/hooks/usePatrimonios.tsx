'use client';

import { useState, useCallback } from 'react';
import api from '../lib/api';
import { Patrimonio } from '@/app/types/Patrimonio';
import Swal from 'sweetalert2';

export function usePatrimonios() {
    const [patrimonios, setPatrimonios] = useState<Patrimonio[]>([]);
    const [loading, setLoading] = useState(false);

    const extrairErro = (error: any, mensagemPadrao: string) => {
        const data = error.response?.data;

        if (data) {
            if (data.erro) return String(data.erro);
            if (data.message) return String(data.message);
            if (data.error) return String(data.error);
        }

        return error.message || mensagemPadrao;
    };

    const listarPatrimonios = useCallback(async () => {
        setLoading(true);

        try {
            const resposta = await api.get('/patrimonio');
            setPatrimonios(resposta.data);
        } catch (error: any) {
            Swal.fire(
                'Erro!',
                extrairErro(error, "Erro ao buscar patrimônios"),
                'error'
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const excluir = async (id: number) => {
        const confirmacao = await Swal.fire({
            title: 'Excluir patrimônio?',
            text: "Esta ação não poderá ser desfeita!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#9ca3af',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        });

        if (confirmacao.isConfirmed) {
            try {
                await api.delete(`/patrimonio/${id}`);

                Swal.fire(
                    'Excluído!',
                    'O patrimônio foi removido.',
                    'success'
                );

                listarPatrimonios();
            } catch (error: any) {
                Swal.fire(
                    'Erro!',
                    extrairErro(error, "Erro ao excluir"),
                    'error'
                );
            }
        }
    };

    return {
        patrimonios,
        loading,
        listarPatrimonios,
        excluir
    };
}