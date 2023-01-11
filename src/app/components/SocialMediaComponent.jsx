
import {
    styled,
    IconButton
} from "@mui/material";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.text.primary,
}));

const SocialMediaComponent = (props) => {
    return (
        // <StyledIconButton style={{ ...props.style }}>
        //     <a href={props.url} target="_blank">
        //         {props.children}
        //     </a>
        // </StyledIconButton>
        <a key={props.key} href={props.url} target="_blank">
            <img className="ml-1 mr-2" style={{ width: '15%', height: '15%', ...props.iconStyle }} src={props.icon} />
        </a>

    )
}

export default SocialMediaComponent