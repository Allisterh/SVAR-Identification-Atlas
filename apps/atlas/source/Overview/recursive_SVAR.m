function [C0, B] = recursive_SVAR(u)
        select =sum(isnan(u),2)==0;  
        u = u(select,:) ;



        Sigma = cov( u  ) ;
        B =  chol(Sigma, "lower") ;


        
        C0 = inv(B);
end