import http from "./http";

export const addBalance = async(debit) => {
    console.log(debit)
  
    const res = await http.post(`/add_balance`, debit, {
    });
    return res.status;
  };
  
  export const removeBalance = async(debit) => {
  
    const res = await http.post(`/remove_balance`, debit, {
    });
    return res.status;
  };

  export const loadBalance = async () => {
    try {
        const res = await http.get(`/balance`, {
            headers: {
                Accept: "application/json",
            }
        });
        return res.data;
    } catch (err: any) {
        console.error(err.message);
    }
  }