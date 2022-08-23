//project resources
import { Helmet } from "react-helmet";
import { makeStyles } from "@mui/styles";

import theme from "../util/theme";

//components
import FooterMobile from "../components/FooterMobile";

//media
import Clothes from "../images/clothes.png";
import CirclesFrame from "../images/circles.png";
import { useTranslation } from "react-i18next";

const LandingPageMobile = () => {
	const classes = makeStyles(theme as any)();
	const { t } = useTranslation();

	return (
		<>
			<Helmet>
				<title>The Clothing Loop | Home</title>
				<meta name="description" content="Home" />
			</Helmet>
			<div id="landing-page-mobile">
				<div style={{ display: "flex", justifyContent: "center" }}>
					<h1
						style={{
							fontFamily: "Montserrat",
							fontSize: "14px",
							lineHeight: "24px",
							color: "#3C3C3B",
							textAlign: "center",
							fontWeight: "normal",
							margin: "5% 0",
						}}
					>
						THE CLOTHING LOOP
					</h1>
				</div>

				<div style={{ position: "relative" }}>
					<div
						style={{
							position: "absolute",
							height: "341px",
							width: "95%",
							backgroundColor: "#F7C86F",
							opacity: "0.3",
							top: "10%",
						}}
					></div>

					<h1
						style={{
							fontFamily: "Playfair Display",
							fontStyle: "normal",
							fontSize: "48px",
							lineHeight: "56px",
							color: "#C58C41",
							margin: "5% 5%",
							zIndex: "11",
							position: "relative",
						}}
						dangerouslySetInnerHTML={{ __html: t("joinTheBrMovement") }}
					></h1>

					<p
						style={{
							fontFamily: "Montserrat",
							fontStyle: "normal",
							fontSize: "16px",
							lineHeight: "24px",
							color: "#C58C41",
							margin: "5% 5%",
							zIndex: "111",
							position: "relative",
						}}
					>
						{t("currentlyWeAreDevelopingOurPlatform")}
					</p>
					<div style={{ position: "relative", width: "70%", margin: "5% 0" }}>
						<img src={Clothes} style={{ width: "100%", height: "auto" }} />
					</div>
					<div
						style={{
							position: "absolute",
							bottom: "10%",
							height: "30%",
							overflow: "hidden",
							right: "0",
						}}
					>
						<img
							src={CirclesFrame}
							style={{ maxWidth: "100%", maxHeight: "100%", marginLeft: "50%" }}
						/>
					</div>
				</div>

				<FooterMobile />
			</div>
		</>
	);
};

export default LandingPageMobile;
