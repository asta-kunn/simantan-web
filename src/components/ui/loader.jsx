import React from 'react'
import { RingLoader } from 'react-spinners';

const Loader = ({ loading }) => {
    return <RingLoader
        color={"#B32017"}
        loading={loading}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
    />
}

export default Loader
