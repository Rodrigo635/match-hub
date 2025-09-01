import GamesList from '@/components/GamesList';

export const metadata = {
  title: 'Jogos - MATCH HUB',
};

export default function JogosPage() {
  return (
    <>
      <main >
        <GamesList />
      </main>
    </>
  );
}