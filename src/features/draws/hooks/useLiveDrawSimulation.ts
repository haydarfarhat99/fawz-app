import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  playDigitReveal,
  playDigitTick,
  playDrumRoll,
  playLoseTone,
  playWinFanfare,
} from '@core/utils/sound';
import { drawKeys } from '../services/draw.service';
import type { ConnectionState, DrawDigitEvent, WinnerTier } from '../types/draw.types';

export type LivePhase = 'waiting' | 'broadcasting' | 'finalizing' | 'finalized';
export type LiveScenario = 'win' | 'win_4' | 'win_6' | 'win_8' | 'jackpot' | 'lose' | 'random';
export type ResolvedScenario = 'win_4' | 'win_6' | 'win_8' | 'jackpot' | 'lose';
export type LiveDrawType = 'weekly' | 'monthly';

export interface SimulationOptions {
  totalDigitsPerNumber?: number;
  digitIntervalMs?: number;
  startDelayMs?: number;
  betweenNumbersMs?: number;
  finalizationMs?: number;
  scenario?: LiveScenario;
  drawType?: LiveDrawType;
}

export interface LiveDrawState {
  phase: LivePhase;
  digits: DrawDigitEvent[];
  connection: ConnectionState;
  viewerCount: number;
  scenario: ResolvedScenario;
  drawType: LiveDrawType;
  numbersCount: number;
  result?: {
    isWinner: boolean;
    tier?: WinnerTier;
    prizeIqd?: number;
    matchedFawzNumber?: string;
    matchedNumberIndex?: number;
    winningNumbers: string[];
  };
}

const POSSIBLE_WINNERS = ['9387541206', '4521098763', '1736294085'];

function getNumbersCount(drawType: LiveDrawType): number {
  return drawType === 'monthly' ? 3 : 1;
}

function getJackpot(drawType: LiveDrawType): number {
  return drawType === 'monthly' ? 250_000_000 : 50_000_000;
}

/** Build a user number that matches the chosen scenario's tail length */
function buildUserNumberForScenario(scenario: ResolvedScenario, primaryWin: string): string {
  const random10 = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
  switch (scenario) {
    case 'jackpot':
      return primaryWin;
    case 'win_8':
      return random10.slice(0, 2) + primaryWin.slice(-8);
    case 'win_6':
      return random10.slice(0, 4) + primaryWin.slice(-6);
    case 'win_4':
      return random10.slice(0, 6) + primaryWin.slice(-4);
    case 'lose':
      return random10.slice(0, 6) + '5577';
  }
}

function resolveScenario(s?: LiveScenario): ResolvedScenario {
  if (s === 'win' || s === 'win_4') return 'win_4';
  if (s === 'win_6') return 'win_6';
  if (s === 'win_8') return 'win_8';
  if (s === 'jackpot') return 'jackpot';
  if (s === 'lose') return 'lose';
  const tiers: ResolvedScenario[] = ['win_4', 'win_6', 'win_8', 'jackpot', 'lose'];
  return tiers[Math.floor(Math.random() * tiers.length)];
}

function tierFromScenario(
  scenario: ResolvedScenario,
  drawType: LiveDrawType,
): { tier: WinnerTier; prize: number } | null {
  switch (scenario) {
    case 'jackpot':
      return { tier: 'last_10', prize: getJackpot(drawType) };
    case 'win_8':
      return { tier: 'last_8', prize: 5_000_000 };
    case 'win_6':
      return { tier: 'last_6', prize: 250_000 };
    case 'win_4':
      return { tier: 'last_4', prize: 10_000 };
    case 'lose':
      return null;
  }
}

export function useLiveDrawSimulation(opts: SimulationOptions = {}): LiveDrawState {
  const {
    totalDigitsPerNumber = 10,
    digitIntervalMs = 700,
    startDelayMs = 1500,
    betweenNumbersMs = 900,
    finalizationMs = 1600,
    scenario,
    drawType = 'weekly',
  } = opts;

  const numbersCount = getNumbersCount(drawType);
  const initialScenario = resolveScenario(scenario);
  const scenarioRef = useRef<ResolvedScenario>(initialScenario);
  const qc = useQueryClient();

  const [state, setState] = useState<LiveDrawState>({
    phase: 'waiting',
    digits: [],
    connection: 'connecting',
    viewerCount: 543_210,
    scenario: initialScenario,
    drawType,
    numbersCount,
  });

  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const winningNumbers = POSSIBLE_WINNERS.slice(0, numbersCount);
    scenarioRef.current = resolveScenario(scenario);
    setState((s) => ({
      ...s,
      scenario: scenarioRef.current,
      drawType,
      numbersCount,
      digits: [],
      result: undefined,
      phase: 'waiting',
    }));

    const schedule = (fn: () => void, delay: number) => {
      const id = window.setTimeout(fn, delay);
      timersRef.current.push(id);
      return id;
    };

    schedule(() => setState((s) => ({ ...s, connection: 'connected' })), 600);

    const viewerInterval = window.setInterval(() => {
      setState((s) => ({ ...s, viewerCount: s.viewerCount + Math.floor(Math.random() * 47) - 12 }));
    }, 1500);
    timersRef.current.push(viewerInterval);

    schedule(() => {
      setState((s) => ({ ...s, phase: 'broadcasting' }));
      playDrumRoll();
    }, startDelayMs);

    let cursor = startDelayMs + 200;
    for (let n = 0; n < numbersCount; n++) {
      const numberStr = winningNumbers[n] ?? '0000000000';
      if (n > 0) {
        const dr = cursor;
        schedule(() => playDrumRoll(), dr);
      }
      for (let pos = totalDigitsPerNumber - 1; pos >= 0; pos--) {
        const event: DrawDigitEvent = {
          numberIndex: n as 0 | 1 | 2,
          digitPosition: pos,
          digitValue: parseInt(numberStr[pos] ?? '0', 10),
          timestamp: new Date().toISOString(),
        };
        const eventCursor = cursor;
        const isLastDigit = pos === 0;
        schedule(() => {
          setState((s) => ({ ...s, digits: [...s.digits, event] }));
          if (isLastDigit) playDigitReveal();
          else playDigitTick();
        }, eventCursor);
        cursor += digitIntervalMs;
      }
      cursor += betweenNumbersMs;
    }

    schedule(() => setState((s) => ({ ...s, phase: 'finalizing' })), cursor);

    schedule(() => {
      const resolved = scenarioRef.current;
      const tierInfo = tierFromScenario(resolved, drawType);
      const isWinner = tierInfo !== null;
      const primaryWin = winningNumbers[0];
      const userNumber = buildUserNumberForScenario(resolved, primaryWin);

      setState((s) => ({
        ...s,
        phase: 'finalized',
        result: {
          isWinner,
          tier: tierInfo?.tier,
          prizeIqd: tierInfo?.prize,
          matchedFawzNumber: isWinner ? userNumber : undefined,
          matchedNumberIndex: isWinner ? 0 : undefined,
          winningNumbers,
        },
      }));

      if (isWinner) playWinFanfare();
      else playLoseTone();

      try {
        sessionStorage.setItem('fawz.lastDraw.scenario', resolved);
        sessionStorage.setItem('fawz.lastDraw.drawType', drawType);
        if (isWinner && tierInfo && userNumber) {
          sessionStorage.setItem(
            'fawz.lastDraw.win',
            JSON.stringify({ tier: tierInfo.tier, prize: tierInfo.prize, fawzNumber: userNumber }),
          );
        } else {
          sessionStorage.removeItem('fawz.lastDraw.win');
        }
      } catch {
        /* ignore */
      }
      // Invalidate cached "my result" so the detail page re-derives from
      // the just-updated session state instead of returning a stale win.
      qc.removeQueries({ queryKey: drawKeys.myResult('draw-143') });
      qc.removeQueries({ queryKey: drawKeys.detail('draw-143') });
    }, cursor + finalizationMs);

    return () => {
      timersRef.current.forEach((id) => {
        window.clearTimeout(id);
        window.clearInterval(id);
      });
      timersRef.current = [];
    };
  }, [betweenNumbersMs, digitIntervalMs, drawType, finalizationMs, numbersCount, qc, scenario, startDelayMs, totalDigitsPerNumber]);

  return state;
}

export function getDigitForSlot(
  digits: DrawDigitEvent[],
  numberIndex: number,
  position: number,
): number | null {
  const event = digits.find(
    (d) => d.numberIndex === numberIndex && d.digitPosition === position,
  );
  return event ? event.digitValue : null;
}
