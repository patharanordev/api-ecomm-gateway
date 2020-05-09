import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { TableBody, TableCell, TableRow } from '@material-ui/core';

export default function TableBodySkeleton(props) {
    const row = [...Array(props.row ? props.row : 5).keys()]
    const col = [...Array(props.col ? props.col : 4).keys()]

    return (
        <TableBody>
        {
            row.map((r,rIndex) => {
                return (
                    <TableRow key={`r${rIndex}`}>
                    {
                        col.map((c,cIndex) => {
                            return (
                                <TableCell key={`r${rIndex}-c${cIndex}`}>
                                    <Skeleton variant="text" key={`r${rIndex}-c${cIndex}-s${rIndex}${cIndex}`}/>
                                </TableCell>
                            )
                        })
                    }
                    </TableRow>
                )
            })
        }
        </TableBody>
    )
}