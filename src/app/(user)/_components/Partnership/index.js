import NewPartner from "./NewPartner";
import Partner from "./Partner";
import { getUser } from "@/app/_lib/userProfiles";

export default async function Partnership({ user }) {
  const getUserData = await getUser();
  const { document } = getUserData;
  const { affiliateData } = document;
  console.log(affiliateData);

  return (
    <>
      {affiliateData.isAffiliated ? (
        <Partner user={document} />
      ) : (
        <NewPartner user={document} />
      )}
    </>
  );
}
