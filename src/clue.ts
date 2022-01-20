import { ordinal } from "./util";

export enum Clue {
  Absent,
  Elsewhere,
  Correct,
}

export interface CluedLetter {
  clue?: Clue;
  letter: string;
}

export function clue(word: string, target: string): CluedLetter[] {
  let elusive: string[] = [];
  target.split("").forEach((letter, i) => {
    if (word[i] !== letter) {
      elusive.push(letter);
    }
  });
  return word.split("").map((letter, i) => {
    let j: number;
    if (target[i] === letter) {
      return { clue: Clue.Correct, letter };
    } else if ((j = elusive.indexOf(letter)) > -1) {
      // "use it up" so we don't clue at it twice
      elusive[j] = "";
      return { clue: Clue.Elsewhere, letter };
    } else {
      return { clue: Clue.Absent, letter };
    }
  });
}

export function clueClass(clue: Clue): string {
  if (clue === Clue.Absent) {
    return "letter-absent";
  } else if (clue === Clue.Elsewhere) {
    return "letter-elsewhere";
  } else {
    return "letter-correct";
  }
}

export function clueWord(clue: Clue): string {
  if (clue === Clue.Absent) {
    return "no";
  } else if (clue === Clue.Elsewhere) {
    return "elsewhere";
  } else {
    return "correct";
  }
}

export function describeClue(clue: CluedLetter[]): string {
  return clue
    .map(({ letter, clue }) => letter.toUpperCase() + " " + clueWord(clue!))
    .join(", ");
}

export function violation(
  clues: CluedLetter[],
  guess: string
): string | undefined {
  let i = 0;
  for (const { letter, clue } of clues) {
    if (clue === Clue.Absent) {
      // Apparently Wordle doesn't enforce this?
      // But I do!
      if (guess.includes(letter))
        return "Guess can't contain " + letter.toUpperCase();
    } else if (clue === Clue.Correct) {
      if (guess[i] !== letter)
        return ordinal(i + 1) + " letter must be " + letter.toUpperCase();
    } else if (clue === Clue.Elsewhere) {
      if (!guess.includes(letter))
        return "Guess must contain " + letter.toUpperCase();
    }
    ++i;
  }
  return undefined;
}
