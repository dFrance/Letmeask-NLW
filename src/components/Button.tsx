import { ButtonHTMLAttributes } from "react";

import '../styles/button.scss'
type ButtonProps = {color?: string, LoggedClasse?: string} & ButtonHTMLAttributes<HTMLButtonElement>;

function Button(props: ButtonProps) {

    return <button className={"button " + props.color + " " + props.LoggedClasse}   {...props}></button>
};

export default Button;