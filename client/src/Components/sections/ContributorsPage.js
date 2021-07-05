import React from "react";
import {
  Grid,
  Typography,
  Avatar,
  Divider,
  Link,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { pink } from "@material-ui/core/colors";

const useStyles = makeStyles({
  avatar: {
    margin: 10,
    width: 80,
    height: 80,
  },
  avatarContainer: {
    width: "50%",
  },
  divider: {
    width: "100%",
    margin: 10,
  },
  miniContainer: {
    margin: 10,
    "& div": {
      margin: "2px",
    },
    "& .MuiAvatar-root": {
      marginRight: 20,
      marginLeft: 10,
      background: pink[500],
      color: "#fff",
    },
  },
});

const ContributorsPage = () => {
  const classes = useStyles();

  return (
    <>
      <br />
      <Grid container justify="center" style={{height: '100vh', color: '#fff'}}>
        <Grid
          component={Link}
          href="https://github.com/avking007"
          target="blank"
          container
          direction="column"
          alignItems="center"
          color="inherit"
          className={classes.avatarContainer}
        >
          <Avatar
            className={classes.avatar}
            src="https://avatars.githubusercontent.com/u/48752936?v=4"
          />
          <Typography variant="h5">Anish Varshney</Typography>
        </Grid>

        <Grid
          container
          direction="column"
          alignItems="center"
          className={classes.avatarContainer}
          component={Link}
          href="https://github.com/meghnavarma0"
          target="blank"
          color="inherit"
        >
          <Avatar
            className={classes.avatar}
            src="https://avatars.githubusercontent.com/u/53870079?v=4"
          />
          <Typography variant="h5">Meghna Varma</Typography>
        </Grid>
        <Grid
          container
          direction="column"
          alignItems="center"
          className={classes.avatarContainer}
          component={Link}
          href="https://github.com/charu-24"
          target="blank"
          color="inherit"
        >
          <Avatar
            className={classes.avatar}
            src="https://avatars.githubusercontent.com/u/53303041?v=4"
          />
          <Typography variant="h5">Charu Aggrwal</Typography>
        </Grid>
        <Grid
          container
          direction="column"
          alignItems="center"
          className={classes.avatarContainer}
          component={Link}
          target="blank"
          color="inherit"
        >
          <Avatar
            className={classes.avatar}
            src="https://avatars2.usercontent.com/u/21976188?s=300"
          />
          <Typography variant="h5">Khushboo Singh</Typography>
        </Grid>
        <Divider className={classes.divider} />
      </Grid>
    </>
  );
};

export default ContributorsPage;
