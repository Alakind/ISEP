import DashboardStatistics from "../../components/dashboard/DashboardStatistics.tsx";
import {useEffect, useState} from "react";
import {InviteInterface} from "../../utils/types.tsx";
import {getInvites} from "../../utils/apiFunctions.tsx";
import {toast} from "react-toastify";
import LoadingPage from "../../components/LoadingPage.tsx";

function DashboardStatisticsContainer({totalItems}: Readonly<Props>) {
  const [loading, setLoading] = useState<boolean>(false);
  const [totalWillExpire, setTotalWillExpire] = useState<number>(0);
  const [totalExpired, setTotalExpired] = useState<number>(0)

  useEffect((): void => {
    async function fetchData(): Promise<void> {
      setLoading(true);
      try {
        const res: InviteInterface[] = await getInvites();
        setTotalWillExpire(res.filter((invite: InviteInterface): boolean => {
          const expirationDate = new Date(invite.expiresAt);
          const today = new Date();
          const twoDays = new Date();
          twoDays.setDate(twoDays.getDate() + 2);
          return expirationDate > today && expirationDate <= twoDays;
        }).length);
        setTotalExpired(res.filter((invite: InviteInterface): boolean => {
          return invite.status === 'expired';
        }).length);

      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error("Unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData().then();
  }, []);


  return (
    loading
      ? (
        <LoadingPage additionalClasses={"page--mod"}/>
      ) : (
        <DashboardStatistics
          totalItems={totalItems}
          totalWillExpire={totalWillExpire}
          totalExpired={totalExpired}
        />
      )
  )
}

interface Props {
  totalItems: number;
}

export default DashboardStatisticsContainer
