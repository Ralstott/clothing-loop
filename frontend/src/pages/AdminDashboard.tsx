//Resources
import { TwoColumnLayout } from "../components/Layouts";
import { AuthContext } from "../providers/AuthProvider";
import { userPurge } from "../api/user";
import { ToastContext } from "../providers/ToastProvider";
import { Link, useHistory } from "react-router-dom";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { authUser } = useContext(AuthContext);

  const history = useHistory();
  const { addToastStatic } = useContext(ToastContext);
  function deleteClicked() {
    addToastStatic({
      message: t("deleteAccount"),
      type: "warning",
      actions: [
        {
          text: t("delete"),
          type: "ghost",
          fn: () => {
            userPurge(authUser!.uid);
            history.push("/users/logout");
          },
        },
      ],
    });
  }

  return (
    <main className="pt-10">
      {authUser && (
        <TwoColumnLayout img="https://ucarecdn.com/6ac2be4c-b2d6-4303-a5a0-c7283759a8e9/-/resize/x600/-/format/auto/-/quality/smart/denise.png">
          <div className="md:pl-10 md:pr-20 flex flex-col items-center justify-center text-center max-md:mb-10">
            <h3 className="font-serif font-bold text-5xl text-secondary mb-8">{`Hello, ${authUser?.name}`}</h3>
            <p className="mb-6">{t("thankYouForBeingHere")}</p>

            <Link className="btn btn-primary mb-4" to="/loops">
              {t("viewLoops")}
            </Link>

            <Link
              className="btn btn-link text-base block h-auto mb-4 text-black"
              target="_blank"
              to={{
                pathname:
                  "https://drive.google.com/drive/folders/1iMJzIcBxgApKx89hcaHhhuP5YAs_Yb27",
              }}
            >
              {t("goToTheToolkitFolder")}
            </Link>

            <button className="btn btn-error block" onClick={deleteClicked}>
              {t("deleteUserBtn")}
            </button>
          </div>
        </TwoColumnLayout>
      )}
    </main>
  );
}
