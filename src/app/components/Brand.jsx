import { Box, styled } from '@mui/material';
import { MatxLogo } from 'app/components';
import useSettings from 'app/hooks/useSettings';
import { useEffect, useState } from 'react';
// import LuvFilmsLogo from './LuvFilmsLogo';
import { Span } from './Typography';

const BrandRoot = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 18px 20px 29px',
}));

const StyledSpan = styled(Span)(({ mode }) => ({
  fontSize: 18,
  marginLeft: '.5rem',
  display: mode === 'compact' ? 'none' : 'block',
}));

const Brand = ({ children }) => {
  const { settings } = useSettings();
  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode } = leftSidebar;
  const [orgLogo, setOrgLogo] = useState();

  const organizationData = async () => {
    let orgIdFromSession = JSON.parse(sessionStorage.getItem("organizationData"));
    setOrgLogo(orgIdFromSession.logo);
  }

  useEffect(() => {
    organizationData();
  }, [orgLogo !== undefined])

  return (
    <BrandRoot>
      <Box display="flex" alignItems="center">
        <MatxLogo imgUrl={orgLogo} />
        {/* <img src={orgLogo} style={{ height: "24px", width: "24px" }} /> */}
        {/* <StyledSpan mode={mode} className="sidenavHoverShow">
          Talent Hunt
        </StyledSpan> */}
      </Box>

      <Box className="sidenavHoverShow" sx={{ display: mode === 'compact' ? 'none' : 'block' }}>
        {children || null}
      </Box>
    </BrandRoot>
  );
};

export default Brand;
