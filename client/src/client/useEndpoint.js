import { useState, useEffect } from "react";

import axios from "axios";

/**
 * Hook to handle several states to fetch and post data from a endpoint
 * @param {string} req - Axios request object
 */
function useEndpoint(req) {
    const [res, setRes] = useState({
      data: null,
      complete: false,
      pending: false,
      error: false
    });
  
    useEffect(() => {
      setRes({
        data: null,
        pending: true,
        error: false,
        complete: false
      });
      axios(req)
        .then(res =>
          setRes({
            data: res.data,
            pending: false,
            error: false,
            complete: true
          })
        )
        .catch(() =>
          setRes({
            data: null,
            pending: false,
            error: true,
            complete: true
          })
        );
    }, [req.url]);
    return res;
  }
  
export default useEndpoint