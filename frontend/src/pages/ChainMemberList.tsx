import { useState, useEffect, useContext } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

import { Grid, Typography, Switch, FormControlLabel } from "@mui/material";
import {
  EditOutlined as EditIcon,
  Clear as DeleteIcon,
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";

// Project resources
import theme from "../util/theme";
import { AuthContext, AuthProps } from "../components/AuthProvider";
import { UserDataExport } from "../components/DataExport";
import Popover from "../components/Popover";
import {
  ChainParticipantsTable,
  TableUserColumn,
} from "../components/ChainParticipantsTable";
import { Title } from "../components/Typography";
import {
  chainGet,
  chainRemoveUser,
  chainUpdate,
  ChainUpdateBody,
} from "../api/chain";
import { Chain, User } from "../api/types";
import { GenderI18nKeys, Genders, SizeI18nKeys, Sizes } from "../api/enums";
import { userGetAllByChain } from "../api/user";

interface Params {
  chainUID: string;
}

const memberColumns: TableUserColumn[] = [
  { headerName: "name", propertyName: "name" },
  { headerName: "address", propertyName: "address" },
  { headerName: "email", propertyName: "email" },
  { headerName: "phone", propertyName: "phone_number" },
  { headerName: "interested size", propertyName: "sizes" },
];

const adminColumns: TableUserColumn[] = [
  { headerName: "name", propertyName: "name" },
  { headerName: "email", propertyName: "email" },
  { headerName: "phone", propertyName: "phone_number" },
];

const useStyles = makeStyles(theme as any);

const ChainMemberList = () => {
  const location = useLocation<any>();
  const { chainUID } = useParams<Params>();
  const authUser = useContext<AuthProps>(AuthContext).authUser;

  const [chain, setChain] = useState<Chain>();
  const [users, setUsers] = useState<User[]>();
  const [publishedValue, setPublishedValue] = useState(true);
  const [error, setError] = useState("");

  const [isChainAdmin, setIsChainAdmin] = useState<boolean>();
  const { t } = useTranslation();

  const handleChange = async (e: {
    target: { checked: boolean; name: any };
  }) => {
    let isChecked = e.target.checked;
    setPublishedValue(isChecked);

    console.log(
      `updating chain data: ${JSON.stringify({ published: isChecked })}`
    );
    try {
      await chainUpdate({
        uid: chainUID,
        published: isChecked,
      });
    } catch (e: any) {
      console.error(`Error updating chain: ${JSON.stringify(e)}`);
      setError(e?.data || `Error: ${JSON.stringify(e)}`);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const chainData = (await chainGet(chainUID)).data;
        if (chainData === undefined) {
          console.error(`chain ${chainUID} does not exist`);
        } else {
          setChain(chainData);
          const chainUsers = (await userGetAllByChain(chainUID)).data;
          setUsers(chainUsers);
          setPublishedValue(chainData.published);
        }
      } catch (error: any) {
        console.error(`Error getting chain: ${error}`);
      }
    })();
  }, []);

  useEffect(() => {
    setIsChainAdmin(
      authUser?.chains.find((c) => c.chain_uid === chain?.uid)?.is_chain_admin
    );
  }, [authUser, chain]);

  const handleRemoveFromChain = async (userUID: string) => {
    await chainRemoveUser(chainUID, userUID);

    const chainUsers = (await userGetAllByChain(chainUID)).data;
    setUsers(chainUsers);
  };

  const classes = useStyles();

  return !chain || !users ? null : (
    <>
      <Helmet>
        <title>The Clothing Loop | Loop Members</title>
        <meta name="description" content="Loop Members" />
      </Helmet>

      <div className="chain-member-list">
        <Grid container direction="column" spacing={6}>
          <Grid
            item
            classes={{ root: classes.gridItemsNoPadding }}
            container
            spacing={4}
          >
            <Grid item classes={{ root: classes.gridItemsNoPadding }} sm>
              <div className="chain-member-list__card">
                {location.state ? (
                  <p className="success">{location.state.message}</p>
                ) : null}

                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  wrap="nowrap"
                  spacing={0}
                >
                  <Grid item>
                    <Title>{chain.name}</Title>
                  </Grid>
                  <Grid item>
                    <Link to={`/loops/${chainUID}/edit`}>
                      <EditIcon />
                    </Link>
                  </Grid>
                </Grid>

                <Typography
                  classes={{ root: classes.descriptionTypographyRoot }}
                >
                  {chain.description}
                </Typography>

                <Field title="Categories">
                  {chain?.genders &&
                    chain?.genders
                      .map(
                        (gender, i) => `${GenderI18nKeys[gender]}'S CLOTHING`
                      )
                      .join(" / ")}
                </Field>
                <Field title="Sizes">
                  {chain?.sizes &&
                    chain?.sizes
                      .map((size, i) => t(SizeI18nKeys[size]))
                      .join(" / ")}
                </Field>
                <Field title="Participants">{`${users.length} ${
                  users.length === 1 ? "person" : "people"
                }`}</Field>

                <div style={{ position: "relative", display: "inline" }}>
                  <FormControlLabel
                    classes={{ root: classes.switchGroupRoot }}
                    value={publishedValue}
                    control={
                      <Switch
                        checked={publishedValue}
                        onChange={handleChange}
                        name="published"
                        color="secondary"
                        inputProps={{ "aria-label": "secondary checkbox" }}
                      />
                    }
                    label={publishedValue ? "visible" : "invisible"}
                    labelPlacement="end"
                  />
                  <Popover message={t("adminSwitcherMessage")} />
                </div>
              </div>
            </Grid>

            <Grid item classes={{ root: classes.gridItemsNoPadding }} sm>
              <div className="chain-member-list__card">
                <div className="chain-member-list__loop-admin__flex-col">
                  <div>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="space-between"
                      wrap="nowrap"
                    >
                      <Grid item>
                        <Title>Loop Admin</Title>
                      </Grid>
                      <Grid item>
                        <Link to={`/users/${(authUser as User).uid}/edit`}>
                          <EditIcon />
                        </Link>
                      </Grid>
                    </Grid>
                    <ChainParticipantsTable
                      columns={adminColumns}
                      authUser={authUser}
                      users={users.filter(
                        (user) =>
                          user.chains.find(
                            (c) => c.chain_uid === chain.uid && c.is_chain_admin
                          ) !== undefined
                      )}
                      initialPage={0}
                      edit
                      remove
                      onRemoveUser={handleRemoveFromChain}
                    />
                  </div>
                  {isChainAdmin && (
                    <Link
                      to={{
                        pathname: `/loops/${chainUID}/addChainAdmin`,
                        state: { users, chainId: chainUID },
                      }}
                    >
                      <div className="chain-member-list__add-co-host">
                        add co-host
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </Grid>
          </Grid>

          <Grid item classes={{ root: classes.gridItemsNoPadding }}>
            <div className="chain-member-list__card">
              <Title>Loop Participants</Title>
              <UserDataExport />

              <ChainParticipantsTable
                columns={memberColumns}
                authUser={authUser}
                users={users}
                initialPage={0}
                edit
                remove
                onRemoveUser={handleRemoveFromChain}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

const Field = ({ title, children }: { title: string; children: any }) => {
  const classes = useStyles();

  return (
    <div className="chain-member-list__field">
      <Typography classes={{ root: classes.fieldSubheadingTypographyRoot }}>
        {title}:
      </Typography>
      <div className="chain-member-list__field-content">{children}</div>
    </div>
  );
};

export default ChainMemberList;
