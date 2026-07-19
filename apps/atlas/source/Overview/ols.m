function [bdach,stf,e,fit,ser]=ols(y,X)

    % [bdach,stf,e,fit,ser]=ols(y,X)
    %
    % OLS regression of (n x 1) vector y on (n x k) matrix X
    % It is required that the first column of X is a constant!
    %
    % Returns:
    % bdach : k x 1 vector of coefficients
    % stf   : k x 1 vector of standard errors
    % e     : n x 1 vector of residuals
    % fit   : n x 1 vector of fitted values
    % ser   : scalar, standard error of regression
    
    % Drop NaNs
    y_old=y;
    select =sum(isnan([y,X]),2)==0;
    y = y(select);
    X = X(select,:);
    
    k=size(X,2); % Number of regressors
    n=size(X,1); % Sample size
    
    % check for enough observations:
    if ~n>k
        error('Zero degrees of freedom!');
    end
    
    % check if first column of X is a constant:
    if var(X(:,1))>0
        error('First column of X must be a constant!');
    end
    
    
    
    bdach=(X'*X)\(X'*y);
    fit = NaN(size(y_old));
    fit(select)=X*bdach;
    e = NaN(size(y_old));
    e(select)=y-fit(select);
    s2=(e(select)'*e(select))/(n-k) ;
    ser=sqrt(s2);
	vcov=s2*inv(X'*X);
    stf=sqrt(diag(vcov)) ;
    te=bdach./stf;
    p=2*(1-tcdf(abs(te),n-k));
    rquad=1-(e(select)'*e(select))/(sum((y-mean(y)).^2));
    rbar=1-((n-1)/(n-k)*(1-rquad));
    
    % F-Test: attention, a constant is assumed
    R=[zeros(k-1,1) eye(k-1)];
    q=zeros(k-1,1);
    fvalue=(((R*bdach-q)')*inv(R*inv(X'*X)*R')*(R*bdach-q))/((k-1)*s2);
    %fvalue=rquad/(1-rquad)*(n-k)/(k-1)
    poff=1-fcdf(fvalue,k-1,n-k);

		disp('');
		disp('--------------------------------------------------------------');   
		disp('                              OLS                            ');   
		disp('--------------------------------------------------------------');   
		line1=sprintf('N  = %3.0f                                   R^2  = %12.4f',n,rquad);
		disp(line1);
		line2=sprintf('DF = %3.0f                                   RBar = %12.4f',n-k,rbar);
		disp(line2);
		line3=sprintf('                                           F    = %12.4f',fvalue);
		disp(line3);
		line4=sprintf('                                           p(F) = %12.4f',poff);
		disp(line4);
		disp(' ');
		disp('variable           coef           se            t            p');
		for i=1:size(bdach,1);
			line=sprintf('%8.0f   %12.4f %12.4f %12.4f %12.4f',i,bdach(i),stf(i),te(i),p(i));
			disp(line);
		end;
		disp('--------------------------------------------------------------');   
	
end
    