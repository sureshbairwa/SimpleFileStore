import {create} from 'zustand';
import axiosInstance from '@/lib/axios';



const useAuthStore = create((set) => ({

    isLoggedIn: false,
    setIsLoggedIn: (isLoggedIn:boolean) => set({isLoggedIn}),
    user: null,
    setUser: (user:any) => set({user}),
    rootFolder:null,
    authCheck: async () => {
        try {
            const response = await axiosInstance.get('/api/auth/authCheck');
            // console.log("response in authCheck",response.data);
            if (response.data.success===true) {
                 set({ user: response.data.user, isLoggedIn: true });
                 set({rootFolder:response.data.user.rootFolder})

            
            } else {
                set({ user: null, isLoggedIn: false });
            }
            
            
            
        } catch (error) {
            console.error("error in authCheck",error);
            
        }
    },
   


}));

export default useAuthStore;
