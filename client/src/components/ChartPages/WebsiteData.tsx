import { Grid, Paper, Box } from "@mui/material";
import ClickGraph from "./Charts/LineGraph-clicks";
import DuelPieGraphs from "./Charts/DuelPieChart-clicks";
import BarGraph from "./Charts/BarGraph-clicks";
import BarGraph_referrer from "./Charts/BarGraph-referrer";
import AiResponseComponent from "./Charts/aiResponse";
import { websiteDataAtom, websiteReferralDataAtom } from "../../state/Atoms";
import ScatterChart from "./Charts/ScatterChart-clicks";
import { useAtom } from "jotai";
import { mapUserData } from "../../services/extractData";
import RadarChart from "./Charts/RadarGraph-clicks";
import StackedBarChart from "./Charts/StackedBarGraph-clicks";
//import Heatmap from "./Charts/Heatmap";

const WebsiteData = () => {
  const [websiteData] = useAtom(websiteDataAtom);
  const allDataResponse = mapUserData(websiteData);
  const [websiteReferralData] = useAtom(websiteReferralDataAtom);
console.log(websiteReferralData)
  return (
    <Box sx={{ padding: 6 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
    
          >
            <BarGraph data={allDataResponse} keyword={"page_url"} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            
          >
            <ScatterChart data={allDataResponse} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
          
          >
            <ClickGraph data={allDataResponse} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              height: "100%",
             
            }}
          >
            <DuelPieGraphs
              data={allDataResponse}
              keyword={"user_browser"}
              keywordTwo={"user_os"}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
       
          >
            <StackedBarChart
              data={allDataResponse}
              keyword={"user_browser"}
              keywordTwo={"page_url"}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
        
          >
            <BarGraph_referrer data={websiteReferralData} />
          </Paper>
        </Grid>


        <Grid item xs={12} md={3.3}>
          <Paper
            elevation={3}
        
          >
            <RadarChart
              data={allDataResponse}
              keyword={"page_url"}
              keywordTwo={"user_browser"}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8.7}>
          <Paper
            elevation={3}
    
          >
            <AiResponseComponent />
          </Paper>
        </Grid>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8.6} sx={{ mt: 18,  }}>
            <Paper
              elevation={3}
       
            >
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WebsiteData;
