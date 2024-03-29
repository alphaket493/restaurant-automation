import PropTypes from 'prop-types';
// material
import { useTheme } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  const theme = useTheme();
  const PRIMARY_LIGHT = theme.palette.primary.light;
  const PRIMARY_MAIN = theme.palette.primary.main;
  const PRIMARY_DARK = theme.palette.primary.dark;

  return (
    <Box sx={{ width: 40, height: 40, ...sx }}>
      <img onClick={() => window.location.href = "/"} src="https://res.cloudinary.com/dx9dnqzaj/image/upload/v1632127508/restaurent_automation/IMG-20210915-WA0005_em36ro.jpg"></img>
    </Box>
  );
}
