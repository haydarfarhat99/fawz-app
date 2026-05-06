import { useTranslation } from 'react-i18next';
import { cn } from '@core/utils/cn';
import { DigitSlot } from './DigitSlot';
import { getDigitForSlot } from '../hooks/useLiveDrawSimulation';
import type { DrawDigitEvent } from '../types/draw.types';

interface DigitGridProps {
  digits: DrawDigitEvent[];
  numbersCount?: number;
  digitsPerNumber?: number;
  matchedFawzNumber?: string;
  matchedNumberIndex?: number;
  matchedTrailingCount?: number;
  spinning?: boolean;
}

export function DigitGrid({
  digits,
  numbersCount = 3,
  digitsPerNumber = 10,
  matchedFawzNumber,
  matchedNumberIndex,
  matchedTrailingCount = 3,
  spinning = false,
}: DigitGridProps) {
  const { t } = useTranslation();
  const labels = [t('draws.firstNumber'), t('draws.secondNumber'), t('draws.thirdNumber')];
  const onlyOneNumber = numbersCount === 1;

  return (
    <div className="space-y-5 md:space-y-6">
      {Array.from({ length: numbersCount }).map((_, n) => {
        const filled = digits.filter((d) => d.numberIndex === n).length;
        const isCurrent = filled < digitsPerNumber;
        const isThisRowSpinning = spinning && filled < digitsPerNumber;
        return (
          <div key={n}>
            <div className="flex items-center justify-between mb-2 px-1">
              <span
                className={cn(
                  'text-[11px] uppercase tracking-[0.2em] font-bold',
                  filled === digitsPerNumber
                    ? 'text-gold-300'
                    : isCurrent
                      ? 'text-brand-200'
                      : 'text-white/40',
                )}
              >
                {onlyOneNumber ? t('draws.winningNumberLabel') : labels[n] ?? `#${n + 1}`}
              </span>
              <span className="text-[11px] tabular-nums text-white/50">
                {filled} / {digitsPerNumber}
              </span>
            </div>
            <div
              dir="ltr"
              className="grid grid-cols-10 gap-0.5 sm:gap-1 md:gap-2 p-1.5 sm:p-2 md:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-sm"
            >
              {Array.from({ length: digitsPerNumber }).map((_, posLtr) => {
                const position = digitsPerNumber - 1 - posLtr;
                const value = getDigitForSlot(digits, n, position);
                const tailIndex = digitsPerNumber - 1 - position;
                const isInMatchTail =
                  matchedNumberIndex === n && tailIndex < matchedTrailingCount;
                const matchedAtSamePos =
                  matchedFawzNumber !== undefined &&
                  isInMatchTail &&
                  matchedFawzNumber.charAt(position) === String(value);
                return (
                  <DigitSlot
                    key={position}
                    value={value}
                    isMatched={matchedAtSamePos}
                    spinning={isThisRowSpinning && value === null}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
