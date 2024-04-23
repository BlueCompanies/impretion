import { auth } from "@/app/api/auth/[...nextauth]/auth";
import NewPartner from "./NewPartner";
import Partner from "./Partner";
import { getUser } from "@/app/_lib/userProfiles";

export default async function Partnership({ user }) {
  const getUserData = await getUser(user.email);
  const { document } = getUserData;
  const { affiliateData } = document;

  return (
    <>
      {affiliateData?.isAffiliated ? (
        <Partner user={document} />
      ) : (
        <NewPartner user={document} />
      )}
    </>
  );
}
