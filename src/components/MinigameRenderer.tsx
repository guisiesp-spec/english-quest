'use client';
import type { Pergunta } from '@/lib/tipos';
import MultiplaEscolha from './minigames/MultiplaEscolha';
import VerdadeiroFalso from './minigames/VerdadeiroFalso';
import Ligar from './minigames/Ligar';

interface Props {
  pergunta: Pergunta;
  onResponder: (resposta: string, correto: boolean) => void;
  readonly?: boolean;
}

export default function MinigameRenderer({ pergunta, onResponder, readonly }: Props) {
  switch (pergunta.tipo) {
    case 'multipla_escolha':
      return <MultiplaEscolha pergunta={pergunta} onResponder={onResponder} readonly={readonly} />;
    case 'verdadeiro_falso':
      return <VerdadeiroFalso pergunta={pergunta} onResponder={onResponder} readonly={readonly} />;
    case 'ligar':
      return <Ligar pergunta={pergunta} onResponder={onResponder} readonly={readonly} />;
    default:
      return <p className="text-red-500">Tipo de minigame desconhecido.</p>;
  }
}
