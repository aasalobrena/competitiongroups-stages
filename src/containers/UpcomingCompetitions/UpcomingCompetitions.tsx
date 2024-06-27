import { useContext, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import CompetitionListFragment from '../../components/CompetitionList';
import { BarLoader } from 'react-spinners';
import { GlobalStateContext } from '../../App';
import NoteBox from '../../components/Notebox';
import { useCompetitionsQuery } from '../../queries';
import { wcaApiFetch } from '../../hooks/useWCAFetch';
import { useInfiniteCompetitions } from '../../hooks/queries/useInfiniteCompetitions';
import { LastFetchedAt } from '../../components/LastFetchedAt';

export default function UpcomingCompetitions() {
  const { online } = useContext(GlobalStateContext);
  const { ref, inView } = useInView();

  const {
    data: upcomingCompetitions,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
    status,
    dataUpdatedAt,
  } = useInfiniteCompetitions();

  const { data } = useCompetitionsQuery();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <>
      {!online && (
        <NoteBox
          text="This app is operating in offline mode. Some competitions may not be available."
          prefix=""
        />
      )}
      {status === 'error' && <div>Error: {error?.toString()}</div>}

      <CompetitionListFragment
        title="Upcoming Competitions"
        competitions={upcomingCompetitions?.pages.flatMap((p) => p) || []}
        loading={status === 'pending'}
        liveCompetitionIds={data?.competitions?.map((c) => c.id) || []}
      />

      {online && status === 'success' && (
        <div className="flex justify-center p-1">
          <button
            ref={ref}
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}>
            {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load Newer' : ''}
          </button>
        </div>
      )}

      {!!dataUpdatedAt && <LastFetchedAt lastFetchedAt={new Date(dataUpdatedAt)} />}

      {isFetchingNextPage && <BarLoader width="100%" />}
    </>
  );
}
