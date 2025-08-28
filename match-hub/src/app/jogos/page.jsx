import GamesList from '@/components/GamesList';

export const metadata = {
  title: 'Jogos - MATCH HUB',
};

export default function HomePage() {
  return (
    <>
      <main >
      <GamesList />
      </main>
    </>
  );
}