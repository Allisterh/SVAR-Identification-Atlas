function irf(a, periods, Y_names)
      A = get_A(a);
      phi = get_phi(A,periods);
      plot_irf(phi, Y_names);
end