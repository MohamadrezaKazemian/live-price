import * as React from 'react';
import {ReactElement, useEffect, useState, useRef} from 'react';
import type {NextPage} from 'next';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import Divider from '@mui/material/Divider';
import Input from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Select, {SelectChangeEvent} from '@mui/material/Select';
// @ts-ignore
import { Sparklines , SparklinesLine,SparklinesSpots } from 'react-sparklines';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

import axios from 'axios';
import CurrencyYuanIcon from '@mui/icons-material/CurrencyYuan';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {makeStyles} from '@mui/styles';
import Skeleton from '@mui/material/Skeleton';

const useStyles = makeStyles({
    //custom css classes
    mainBackground: {
        background: "#FAFAFA",
    },
    navbar: {
        background: "#FAFAFA",
        border: "none",
        boxShadow: "none",
        display: `flex`,
        flexDirection: `row`,
        justifyContent: `space-between`
    },
    registerButton: {
        width: `100%`,
        maxWidth: `114px`,
        height: `38px`,
        background: `rgb(66, 133, 242)`,
    },
    navigateButtons: {
        width: `100%`,
        display: `flex`,
        justifyContent: "flex-start",
        flexDirection: `row`,
        alignItems: `center`,
        gap: `15px`

    },
    myAccount: {
        display: `flex`,
        justifyContent: `flex-end`,
        alignItems: `center`,
        width: `100%`,
        gap: `5px`,
    },
    onlineDot: {
        position: "relative",
        display: "inline-block",
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        margin: "0 8px",
        backgroundColor: "#fbbd06",
    },
    livePrice: {
        padding: `40px 24px`
    },
    toolTip: {
        width: `100%`,
        display: `flex`,
        justifyContent: `space-between`,
    },
    toolBarButton: {
        width: `100%`,
        maxWidth: `156px;`,
        height: `30p`,
        border: "1px solid #e0e0e0",
        borderRadius: `8px`,
        background: `#ffffff`,
        color: "black",
        boxShadow: "none",
        '&:hover': {
            background: `#e0e0e0`,
            boxShadow: `none`
        }
    },
    tHeadItem: {
        border: `none`,

        "&:last-child": {
            width: `20%`,
            borderTopLeftRadius: `12px`,
            borderBottomLeftRadius: `12px`,
        },
        "&:first-child": {
            borderTopRightRadius: `12px`,
            borderBottomRightRadius: `12px`,
        }
    },
    coinName: {
        display: `flex`,
        width: `100%`,
        justifyContent: `center`,
        alignItems: `center`,
        gap: `11px`
    },
    coinNumber: {
        background: `#E0E0E0`,
        padding: `2px`,
        width: `100%`,
        maxWidth: `20px`,
        marginRight: `5px`
        // marginLeft:`0px`
    },
    fullFlex:{
        display:`flex`,
        justifyContent:`center`,
        alignItems:`center`
    },
    starIcon:{
      "&:hover":{
          transition: `all 0.3s ease`,
          transform:`translate(0px,-3px)`,
      }

    }
}, { name: "MuiExample_Component" })
const Home: NextPage = () => {


    //create class function to use as css
    const classes = useStyles()


    const [data, setData] = useState<any>([])  //response data
    const [meta, setMeta] = useState<any>({}) //meta info from response
    const [usdt, setUsdt] = useState<any>({
        buy : 1,
        sell : 1
    }) //price of usdt
    const [priceType, setPriceType] = useState<number>(2); // usdt or toman
    const [sortBy, setSortBy] = useState<any>() //sorting options
    const [page, setPage] = useState<number>(1)
    const [search, setSearch] = useState<string>('')
    const [loading , setLoading] = useState<boolean>(true)

    const handlePriceType = (event: React.SyntheticEvent, newValue: number) => {
        setPriceType(newValue);
    };
    const handleSortByChange = (event: SelectChangeEvent<number>) => {
        setSortBy(event.target.value)
        setPage(0)
        setData([])

    }
    const handleSearchChange = (e: React.SetStateAction<string>) => {
        setData([])
        setSearch(e)
        setPage(1)
    }


    //creating table
    function createData(
        name: ReactElement<any, any>,
        changes: ReactElement<any, any>,
        chart: ReactElement<any, any>,
        quote: ReactElement<any, any>,
        buyPrice: ReactElement<any, any>,
        coinName: ReactElement<any, any>,
    ) {
        return {name, changes, chart, quote, buyPrice, coinName};
    }
    const rows = data.map((items: any, index: number) => {
        return (
            createData(
                <StarBorderIcon cursor={"pointer"} className={classes.starIcon}/>,
                <Typography dir={'ltr'} color={items?.percent.toString().includes('-') ? "#EB4137" :  items?.percent === 0 ? "#757575" :   "#38C084"}>{
                    items?.percent.toString().includes('-') ?`${ items?.percent}%` :   items?.percent.toString().includes('0') ? `${items?.percent}%` : `+${items?.percent}%`
                }</Typography>,
                items.chart.length ? <Sparklines data={items?.chart} width={100} height={60} margin={5}>
                    <SparklinesLine  color={items?.percent.toString().includes('-') ? "#EB4137" : "#38C084"}  />
                    <SparklinesSpots  style={{fill: items?.percent.toString().includes('-') ? "#EB4137" : "#38C084"}} />
                </Sparklines> :
                    <Sparklines data={[0,0]} width={100} height={60} margin={5}>
                    <SparklinesLine  color={items?.percent.toString().includes('-') ? "#EB4137" : "#38C084"}  />
                    <SparklinesSpots  color="white" />
                </Sparklines>               ,
                <Box component={"div"} width={100} margin={"auto"} fontSize={14} gap={`4px`} className={classes.fullFlex}>
                    <Typography component={"span"} color={"#C8C8e8"} fontSize={13}>{priceType === 1 ? "تومان" : "USDT"}</Typography>
                    <Typography component={"span"} fontSize={13}>{priceType === 2 ? items?.quote : items?.price * usdt.sell}</Typography>
                </Box>,
                <Box component={"div"} width={100} margin={"auto"}>
                    {priceType === 2 ?
                        <Box component={"div"} className={classes.fullFlex} gap={`4px`}>
                            <Typography component={"span"} fontWeight={'bold'}>{items?.price}</Typography>
                            <Typography component={"span"} color={"black"}><CurrencyYuanIcon fontSize={"small"}/></Typography>
                        </Box> :
                        <Box component={"div"} gap={`4px`} className={classes.fullFlex}>
                            <Typography component={"span"} color={"#C8C8C8"} fontSize={13}>تومان</Typography>
                            <Typography component={"span"}>{items?.price * usdt.buy}</Typography>
                        </Box>}</Box>,
                <Box component={"div"} className={classes.coinName}>
                    <Box component={"div"} sx={{
                        display: `flex`,
                        flexDirection: `column`,
                        width: `100%`,
                        maxWidth: `200px`,
                        justifyContent: `flex-end`,
                        alignItems: `center`,
                    }}>
                        <Typography component={"span"} sx={{
                            width: `100%`,
                            display: `flex`,
                            justifyContent: `flex-end`
                        }}>{items?.enName}</Typography>
                        <Box component={"div"} sx={{
                            display: `flex`,
                            flexDirection: `rowReverse`,
                            width: `100%`,
                            justifyContent: `flex-end`,
                            alignItems: `center`,
                        }}>
                            <Typography component={"span"} fontSize={13} color={"#B2B2B2"}>{items?.coin}</Typography>
                            <Typography component={"span"} fontSize={10} className={classes.coinNumber}>{index + 1}</Typography>
                        </Box>
                    </Box>
                    <img src={items?.icon} style={{width: `100%`, maxWidth: `36px`}} alt={"icon"}/>
                </Box>
            )
        )
    })


    //checkin if user head to end of the table yet
    const listInnerRef = useRef();
    const onScroll = () => {
        if (listInnerRef.current) {
            const {scrollTop, scrollHeight, clientHeight} = listInnerRef.current;

            if (scrollTop + clientHeight === scrollHeight) {
                if(data.length === meta.paginateHelper.total){
                    return
                }else{
                    setPage(page + 1)
                }
            }
        }
    };



    //fetching data with axios
    const getData = async () => {
        setLoading(true)
        await axios.get(`https://api.bitbarg.me/api/v1/currencies`, {
            params: {
                q: search,
                sort: sortBy,
                page: page
            }
        })
            .then(res => {
                if (data.length < 0) {
                    setData(res?.data?.result?.items)
                } else {
                    setData([...data, ...res?.data?.result?.items])
                }
                setMeta(res?.data?.result?.meta)
                setUsdt({
                    buy : res?.data?.result?.meta?.prices?.buy,
                    sell : res?.data?.result?.meta?.prices?.sell,
                })
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
            })
    }
    useEffect(() => {
        getData()
    }, [sortBy, search, page])
    return (

        <Box className={classes.mainBackground} dir={"rtl"} onScroll={onScroll} ref={listInnerRef}
             sx={{height: `100vh`, overflow: `auto`}}>

            <Container maxWidth={'lg'}>
                <AppBar position="static" className={classes.navbar}>
                    <Box component={"div"} className={classes.navigateButtons}>
                        <Button component={"div"} sx={{gap: `5px`}}>
                            <svg focusable="true"
                                 aria-hidden="true" viewBox="0 0 30 24">
                                <path
                                    d="M1.85759 4.0001C1.55277 3.995 1.26924 4.18446 1.11557 4.49592C0.961903 4.80739 0.961903 5.19261 1.11557 5.50408C1.26924 5.81554 1.55277 6.005 1.85759 5.9999H22.1431C22.4479 6.005 22.7314 5.81554 22.8851 5.50408C23.0387 5.19261 23.0387 4.80739 22.8851 4.49592C22.7314 4.18446 22.4479 3.995 22.1431 4.0001H1.85759Z"> </path>
                                <path
                                    d="M11.4679 11.0001C11.3017 10.995 11.147 11.1845 11.0632 11.4959C10.9794 11.8074 10.9794 12.1926 11.0632 12.5041C11.147 12.8155 11.3017 13.005 11.4679 12.9999H22.5327C22.699 13.005 22.8536 12.8155 22.9375 12.5041C23.0213 12.1926 23.0213 11.8074 22.9375 11.4959C22.8536 11.1845 22.699 10.995 22.5327 11.0001H11.4679Z"> </path>
                                <path
                                    d="M1.85759 18.0001C1.55277 17.995 1.26924 18.1845 1.11557 18.4959C0.961903 18.8074 0.961903 19.1926 1.11557 19.5041C1.26924 19.8155 1.55277 20.005 1.85759 19.9999H22.1431C22.4479 20.005 22.7314 19.8155 22.8851 19.5041C23.0387 19.1926 23.0387 18.8074 22.8851 18.4959C22.7314 18.1845 22.4479 17.995 22.1431 18.0001H1.85759Z"> </path>
                            </svg>
                            <Typography component={"span"} color={"secondary"}>منو</Typography>
                        </Button>
                        <Button color={"secondary"}>خانه</Button>
                        <Button color={"secondary"}>قیمت لحظه ای</Button>
                        <Button color={"secondary"}>کارمزد ها</Button>
                        <Button color={"secondary"}>پورتفوی</Button>
                    </Box>
                    <Box component={"div"} className={classes.myAccount}>
                        <Button variant="contained" className={classes.registerButton}>ورود / ثبت نام</Button>
                        <Divider sx={{height: 28, m: 0.5}} orientation="vertical"/>

                        <Typography component={"span"} sx={{width: `100%`, maxWidth: `119px`, height: `48px`}}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 119 48">
                                <ellipse transform="matrix(0 -1 -1 0 40.218 20.582)" rx="2.7034" ry="2.7561"
                                         fill="#EB4137"/>
                                <ellipse transform="matrix(0 -1 -1 0 38.824 14.276)" rx="2.2097" ry="2.2528"
                                         fill="#EB4137"/>
                                <ellipse transform="matrix(0 -1 -1 0 35.445 9.857)" rx="1.5692" ry="1.5998"
                                         fill="#EB4137"/>
                                <ellipse transform="matrix(0 -1 -1 0 31.683 7.4738)" rx=".93003" ry=".97813"
                                         fill="#EB4137"/>
                                <ellipse transform="matrix(0 -1 -1 0 28.75 6.5746)" rx=".72724" ry=".71149"
                                         fill="#EB4137"/>
                                <ellipse transform="rotate(-90 38.824 26.891)" cx="38.824" cy="26.891" rx="2.2097"
                                         ry="2.2528" fill="#EB4137"/>
                                <ellipse transform="rotate(-90 35.445 31.311)" cx="35.445" cy="31.311" rx="1.5692"
                                         ry="1.5998" fill="#EB4137"/>
                                <ellipse transform="rotate(-90 31.68 33.694)" cx="31.68" cy="33.694" rx=".93004"
                                         ry=".97813" fill="#EB4137"/>
                                <ellipse transform="rotate(-90 28.75 34.593)" cx="28.75" cy="34.593" rx=".72724"
                                         ry=".71149" fill="#EB4137"/>
                                <ellipse cx="20.982" cy="8.5214" rx="2.7561" ry="2.7034" fill="#265FFF"/>
                                <ellipse cx="27.414" cy="9.8878" rx="2.2528" ry="2.2097" fill="#265FFF"/>
                                <ellipse cx="31.919" cy="13.2" rx="1.5998" ry="1.5692" fill="#265FFF"/>
                                <ellipse cx="34.349" cy="16.892" rx=".94817" ry=".9594" fill="#265FFF"/>
                                <ellipse cx="35.267" cy="19.771" rx=".74144" ry=".69788" fill="#265FFF"/>
                                <ellipse transform="matrix(-1 0 0 1 14.552 9.8878)" rx="2.2528" ry="2.2097"
                                         fill="#265FFF"/>
                                <ellipse transform="matrix(-1 0 0 1 10.047 13.2)" rx="1.5998" ry="1.5692"
                                         fill="#265FFF"/>
                                <ellipse transform="matrix(-1 0 0 1 7.62 16.892)" rx=".94818" ry=".9594"
                                         fill="#265FFF"/>
                                <ellipse transform="matrix(-1 0 0 1 6.7 19.771)" rx=".74143" ry=".69788"
                                         fill="#265FFF"/>
                                <ellipse transform="rotate(-90 8.6857 27.444)" cx="8.6857" cy="27.444" rx="2.7034"
                                         ry="2.7561" fill="#FFBA37"/>
                                <ellipse transform="rotate(-90 10.079 21.135)" cx="10.079" cy="21.135" rx="2.2097"
                                         ry="2.2528" fill="#FFBA37"/>
                                <ellipse transform="rotate(-90 13.456 16.718)" cx="13.456" cy="16.718" rx="1.5692"
                                         ry="1.5998" fill="#FFBA37"/>
                                <ellipse transform="rotate(-90 17.22 14.335)" cx="17.22" cy="14.335" rx=".93007"
                                         ry=".97809" fill="#FFBA37"/>
                                <ellipse transform="rotate(-90 20.153 13.433)" cx="20.153" cy="13.433" rx=".72725"
                                         ry=".71149" fill="#FFBA37"/>
                                <ellipse transform="matrix(0 -1 -1 0 10.078 33.75)" rx="2.2097" ry="2.2528"
                                         fill="#FFBA37"/>
                                <ellipse transform="matrix(0 -1 -1 0 13.456 38.169)" rx="1.5692" ry="1.5998"
                                         fill="#FFBA37"/>
                                <ellipse transform="matrix(0 -1 -1 0 17.22 40.552)" rx=".93003" ry=".97812"
                                         fill="#FFBA37"/>
                                <ellipse transform="matrix(0 -1 -1 0 20.155 41.454)" rx=".72724" ry=".71149"
                                         fill="#FFBA37"/>
                                <ellipse transform="matrix(1 0 0 -1 27.978 39.449)" rx="2.7561" ry="2.7034"
                                         fill="#34A853"/>
                                <ellipse transform="matrix(1 0 0 -1 34.407 38.082)" rx="2.2528" ry="2.2097"
                                         fill="#34A853"/>
                                <ellipse transform="matrix(1 0 0 -1 38.912 34.768)" rx="1.5998" ry="1.5692"
                                         fill="#34A853"/>
                                <ellipse transform="matrix(1 0 0 -1 41.344 31.076)" rx=".94818" ry=".9594"
                                         fill="#34A853"/>
                                <ellipse transform="matrix(1 0 0 -1 42.26 28.199)" rx=".74143" ry=".69787"
                                         fill="#34A853"/>
                                <ellipse transform="rotate(180 21.546 38.082)" cx="21.546" cy="38.082" rx="2.2528"
                                         ry="2.2097" fill="#34A853"/>
                                <ellipse transform="rotate(180 17.042 34.768)" cx="17.042" cy="34.768" rx="1.5998"
                                         ry="1.5692" fill="#34A853"/>
                                <ellipse transform="rotate(180 14.612 31.076)" cx="14.612" cy="31.076" rx=".94818"
                                         ry=".9594" fill="#34A853"/>
                                <ellipse transform="rotate(180 13.696 28.199)" cx="13.696" cy="28.199" rx=".74144"
                                         ry=".69788" fill="#34A853"/>
                                <path
                                    d="m51.156 13.001 4.46-0.0068c1.2208-0.0019 2.0432 0.068 2.841 0.3515 1.6206 0.5669 2.8687 1.8461 2.8722 3.8391 0.0025 1.376-0.643 2.6344-2.5851 3.4203 2.4924 0.447 4.0651 2.0816 4.0688 4.1457 0.0047 2.6335-2.2855 3.7521-3.3065 4.0859-0.9961 0.3337-1.7933 0.3349-3.6123 0.3377l-4.7091 0.0072-0.029-16.18v-1e-4zm4.0402 2.0579-1.6196 0.0025 0.0088 4.8636 1.6195-0.0025c0.6229-9e-4 1.6942-0.05 2.2916-0.3831 0.473-0.238 1.3189-0.8799 1.3166-2.161-0.0016-0.9016-0.4515-1.6838-1.1996-2.0148-0.6982-0.3074-1.6948-0.3059-2.4174-0.3047h1e-4zm0.6852 6.9504-2.2923 0.0035 0.0092 5.1009 2.4169-0.0037c0.6976-0.0011 1.8936-0.0029 2.5161-0.2411 1.245-0.4527 1.7664-1.4737 1.7648-2.3278-0.0012-0.688-0.3519-1.7077-1.6235-2.2039-0.6482-0.26-1.4706-0.3299-2.7911-0.3279h-1e-4z"
                                    fill="#4285F2"/>
                                <path
                                    d="m65.165 14.058c0.7669-0.0012 1.3558 0.5687 1.357 1.2346 0.0012 0.6658-0.6112 1.2613-1.3525 1.2625-0.8691 0.0013-1.3306-0.7352-1.3315-1.2584-0.0011-0.5946 0.5601-1.2375 1.327-1.2387zm1.1584 4.493 0.0192 10.678-2.2751 0.0035-0.0191-10.678 2.275-0.0036z"
                                    fill="#EB4137"/>
                                <path
                                    d="m71.66 16.061 0.0039 2.2091 3.4773-0.0053 0.0034 1.9003-3.4773 0.0053 0.0084 4.6557c0.0269 1.3301 0.0518 1.5676 0.3953 1.9471 0.4171 0.427 0.9558 0.4499 1.1762 0.4496 0.4408-7e-4 1.2733-0.0495 2.472-0.764l0.0035 1.9716c-1.0275 0.5479-2.1782 0.716-2.8148 0.7169-0.7592 0.0012-2.1065-0.3055-2.8676-1.3495-0.5401-0.7831-0.5422-1.9232-0.5439-2.8972l-0.0085-4.7269-1.91 3e-3 -4e-4 -0.2138 4.0825-3.9019z"
                                    fill="#FBBD06"/>
                                <path
                                    d="m78.946 12.957 0.0112 6.1962c0.3715-0.2578 1.4119-0.9608 3.0736-0.9634 2.9761-0.0046 4.791 2.401 4.7962 5.3471 0.0067 3.6944-2.6933 5.5925-5.7438 5.5972-1.4136 0.0022-3.2495-0.3223-4.3168-0.8117l-0.0276-15.362 2.2073-0.0034h-1e-4zm0.0147 8.1837 0.0102 5.6818c0.8933 0.2558 1.9599 0.3243 2.3319 0.3238 1.3145-0.0021 3.2969-0.8936 3.2922-3.5125-0.0042-2.3616-1.544-3.5283-3.1313-3.5259-1.24 2e-3 -2.0573 0.6579-2.503 1.0327v1e-4z"
                                    fill="#4285F2"/>
                                <path
                                    d="m97.434 27.257 0.0023 1.2972c-1.0156 0.6502-1.4368 0.8431-2.1312 0.8441-0.9671 0.0015-1.4885-0.334-1.6883-1.1024-0.9658 0.7461-1.9819 1.1081-2.9987 1.1096-1.6367 0.0026-2.7301-1.2449-2.7326-2.6383-0.0038-2.138 2.0037-2.7897 3.7881-3.4171l1.9579-0.6756-1e-3 -0.5766c-0.0024-1.3453-0.673-1.8968-2.0121-1.8947-1.2152 0.0019-2.4541 0.5563-3.5182 1.7831l-0.0042-2.3303c0.8662-0.9862 2.0804-1.4686 3.6924-1.4711 2.2567-0.0034 4.0442 1.0989 4.0486 3.5492l0.01 5.5493c7e-4 0.4084 0.1497 0.5523 0.4225 0.5519 0.2232-4e-4 0.6692-0.2173 1.1645-0.5784v1e-4zm-3.7948-0.2585-0.0056-3.1469c-1.8836 0.6275-3.5192 1.2545-3.5169 2.5278 0.0016 0.8889 0.6723 1.5124 1.5899 1.511 0.6943-0.0011 1.3385-0.3384 1.9326-0.8919z"
                                    fill="#34A853"/>
                                <path
                                    d="m98.462 18.676 2.1249-0.0033 5e-3 2.4582c0.69-1.075 1.69-2.6756 3.194-2.6779 0.311-5e-4 1.266 0.0219 2.51 1.2133l-1.119 1.8633c-0.263-0.2621-1.22-1.0483-2.056-1.047-0.787 0.0012-2.529 0.8631-2.525 3.2975l0.01 5.6086-2.1247 0.0033-0.0192-10.716v-1e-4z"
                                    fill="#EB4237"/>
                                <path
                                    d="m116.66 18.433 3e-3 1.6443-2.266 0.0035c0.863 0.8327 1.16 1.428 1.162 2.3335 1e-3 0.8818-0.514 1.9072-1.03 2.4084-1.475 1.5274-4.481 0.7695-4.479 2.0324 1e-3 0.5958 1.159 0.9514 3.377 1.3769 2.364 0.4491 3.204 1.6155 3.206 2.9738 4e-3 2.1209-1.939 3.4107-5.214 3.4157-2.98 0.0046-5.1-1.3504-5.104-3.233-3e-3 -1.5727 0.858-2.5034 2.778-2.9592-0.764-0.4516-1.11-0.88-1.111-1.3566-1e-3 -0.691 0.687-1.2878 1.746-1.5278v-0.0476c-0.813-0.3324-1.43-0.7842-1.85-1.3555-0.395-0.5475-0.593-1.2144-0.594-2.0008-4e-3 -2.2876 1.84-3.6964 4.82-3.701l4.556-7e-3zm-3.072 3.7222c-2e-3 -1.0247-0.989-1.881-2.146-1.8792-1.207 0.0019-2.19 0.8851-2.188 1.9336 2e-3 1.1676 0.89 1.9526 2.22 1.9506 1.231-0.0019 2.116-0.8373 2.114-2.005zm0.928 9.2208c-3e-3 -1.3583-2.269-1.7123-3.623-1.7102-1.478 0.0022-2.511 0.6711-2.509 1.6243 2e-3 1.0723 1.086 1.6426 3.081 1.6395 1.921-0.0029 3.052-0.5766 3.051-1.5536z"
                                    fill="#FBBD07"/>
                            </svg>
                        </Typography>
                    </Box>
                </AppBar>
            </Container>
            <Container maxWidth={'lg'} className={classes.livePrice}>

                <Box component={"div"} sx={{background: `white`, padding: `24px`, borderRadius: `16px`}}>
                    <Box component={"div"}
                         sx={{width: `100%`, display: `flex`, justifyContent: `flex-start`, gap: `20px`}}>
                        <h2>قیمت لحظه ای</h2>
                        <Box component={"div"} className={classes.fullFlex}>
                            <span className={classes.onlineDot}> </span>

                            <p>{data.length}&nbsp;ارز دیجیتال</p>
                        </Box>
                    </Box>
                    <Box component={"div"} className={classes.toolTip}>
                        <Box component={"div"} sx={{
                            width: `100%`,
                            maxWidth: `346px`,
                        }}>
                            <Input
                                placeholder={"جستجو"}
                                sx={{
                                    '& fieldset': {
                                        borderRadius: '8px',
                                    },
                                }}
                                fullWidth={true}
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{transform: `rotate(90deg)`}}/>
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                            />
                        </Box>
                        <Box component={"div"} sx={{
                            width: `100%`,
                            maxWidth: `382px`,
                            gap: `15px`,
                            display: `flex`,
                            justifyContent: `center`,
                            height: `48px`
                        }}>
                            <Button variant="contained"
                                    startIcon={<StarBorderIcon sx={{padding: `0px 1px`, marginLeft: `7px`}}/>}
                                    className={classes.toolBarButton}>
                                نشان شده ها
                            </Button>
                            <FormControl sx={{width: `100%`, maxWidth: `156px`}}>
                                <InputLabel>ترتیب بر اساس</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    // value={sortBy}
                                    label="ترتیب بر اساس"
                                    onChange={handleSortByChange}
                                >
                                    <MenuItem value={2}>بیشترین قیمت</MenuItem>
                                    <MenuItem value={1}>کمترین قیمت</MenuItem>
                                </Select>
                            </FormControl>

                        </Box>
                        <Box component={"div"} sx={{width: `100%`, maxWidth: `356px`}}>
                            <Tabs sx={{
                                border: `1px solid #e0e0e0`,
                                borderRadius: `8px`,

                            }} value={priceType} onChange={handlePriceType} aria-label="icon tabs example">
                                <Tab sx={{width: `50%`}} value={1} label={"تومان"} aria-label="phone"/>
                                <Tab sx={{width: `50%`}} value={2} label={"تتر"} aria-label="person"/>
                            </Tabs>

                        </Box>
                    </Box>
                    <Box component={"div"}>
                        <TableContainer component={"div"} sx={{marginTop: `25px`}}>
                            <Table sx={{minWidth: 650}} aria-label="simple table">
                                <TableHead sx={{background: `#fafafa`}}>
                                    <TableRow>
                                        <TableCell className={classes.tHeadItem} align="center">نشان کردن</TableCell>
                                        <TableCell className={classes.tHeadItem} align="center">تغییرات</TableCell>
                                        <TableCell className={classes.tHeadItem} align="center">نمودار</TableCell>
                                        <TableCell className={classes.tHeadItem}
                                                   align="center">{priceType === 2 ? "ارزش بازار" : "قیمت فروش"}</TableCell>
                                        <TableCell className={classes.tHeadItem}
                                                   align="center">{priceType === 1 ? "قیمت خرید" : "قیمت جهانی"}</TableCell>
                                        <TableCell className={classes.tHeadItem} align="center">ارز دیجیتال</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row : any) => (
                                         <TableRow
                                                key={row.name}
                                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                            >
                                                <TableCell align="center" component="th" scope="row">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="center">{row.changes}</TableCell>
                                                <TableCell align="center">{row.chart}</TableCell>
                                                <TableCell align="center">{row.quote}</TableCell>
                                                <TableCell align="center">{row.buyPrice}</TableCell>
                                                <TableCell align="center">{row.coinName}</TableCell>
                                            </TableRow>
                                    ))}
                                </TableBody>

                            </Table>
                            {
                                !loading ?
                                    "" : <>
                                        <Skeleton />
                                        <Skeleton animation="wave" />
                                        <Skeleton animation={false} /></>
                            }
                        </TableContainer>
                    </Box>
                </Box>

            </Container>

        </Box>
    );
};

export default Home;
